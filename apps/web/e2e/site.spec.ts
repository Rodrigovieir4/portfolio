import { type Page, expect, test } from "@playwright/test"

/** Espera a coreografia da abertura terminar (laser, foto, nome e textos). */
async function esperarAbertura(page: Page) {
  await expect(page.locator("html[data-revelado]")).toHaveCount(1, {
    timeout: 15_000,
  })
}

/*
 * A raiz escolhe o idioma pelo Accept-Language do navegador. Cada caso fixa
 * o idioma do navegador e confere o destino, que é o que um visitante de fora
 * do Brasil vê primeiro.
 */
test.describe("navegador em português", () => {
  test.use({ locale: "pt-BR" })
  test("a raiz leva ao currículo em português", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/pt$/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Sistemas que rodam no mundo real",
    )
  })
})

test.describe("navegador em inglês", () => {
  test.use({ locale: "en-US" })
  test("a raiz leva ao currículo em inglês", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/en$/)
  })
})

/*
 * O filtro dos certificados é a única lógica de navegador do início: a
 * contagem do botão tem de bater com os cartões que ficam na tela.
 */
test("o filtro dos certificados mostra só a categoria escolhida", async ({
  page,
}) => {
  await page.goto("/pt")
  const grade = page
    .getByRole("heading", { name: "Certificados" })
    .locator("..")
  const filtro = grade.getByRole("button", { name: /Acadêmico \(\d+\)/ })
  const total = Number((await filtro.textContent())?.match(/\d+/)?.[0])

  await filtro.click()
  await expect(filtro).toHaveAttribute("aria-pressed", "true")
  await expect(grade.getByRole("listitem")).toHaveCount(total)
})

test("as páginas do site existem nos três idiomas", async ({ page }) => {
  for (const path of [
    "/pt/projetos",
    "/pt/projetos/esplendido",
    "/en/projects/db-store",
    "/es/proyectos/db-connect",
    "/pt/sobre",
    "/en/about",
    "/es/sobre-mi",
    "/pt/ideias",
    "/en/ideas/programo-com-ia-as-regras",
  ]) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(200)
  }
})

test("o cartão do caso no início abre a história completa", async ({
  page,
}) => {
  await page.goto("/pt")
  await page
    .locator("#casos")
    .getByRole("link", { name: /Duas pessoas, uma cota/ })
    .click()
  await expect(page).toHaveURL(/\/pt\/casos\/duas-pessoas-uma-cota$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Duas pessoas, uma cota",
  )
  for (const parte of ["Problema", "Decisão", "Resultado"]) {
    await expect(page.getByRole("heading", { name: parte })).toBeVisible()
  }

  await page.getByRole("link", { name: /Próximo caso/ }).click()
  await expect(page).toHaveURL(/\/pt\/casos\/o-webhook-que-respondia-ok$/)
})

test("com movimento, o carrossel em arco marca o cartão do centro", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 })
  await page.goto("/pt")
  await page.locator("#casos").scrollIntoViewIfNeeded()
  await expect(page.locator("#casos li.ativo")).toHaveCount(1)
})

test("quem pede menos movimento vê tudo parado e visível", async ({
  browser,
}) => {
  const contexto = await browser.newContext({ reducedMotion: "reduce" })
  const page = await contexto.newPage()
  await page.goto("/pt")
  await expect(page.locator('[data-mov="numero"]').first()).toBeVisible()
  await expect(page.locator('[data-mov="subir"]').first()).not.toHaveAttribute(
    "style",
    /opacity/,
  )
  await expect(page.locator("#casos li.ativo")).toHaveCount(0)
  await contexto.close()
})

test("trocar de idioma mantém a página e traduz o caminho", async ({
  page,
}) => {
  await page.goto("/pt/projetos/db-store")
  await page
    .getByRole("banner")
    .getByRole("link", { exact: true, name: "en" })
    .click()
  await expect(page).toHaveURL(/\/en\/projects\/db-store$/)
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    /\/en\/projects\/db-store$/,
  )
})

test("navegar não recarrega nem repete a abertura; trocar de idioma sim", async ({
  page,
}) => {
  await page.goto("/pt")
  await esperarAbertura(page)
  // Some se a página recarregar.
  await page.evaluate(() => {
    ;(window as Window & { mesmaPagina?: boolean }).mesmaPagina = true
  })
  const mesmaPagina = () =>
    page.evaluate(
      () => (window as Window & { mesmaPagina?: boolean }).mesmaPagina === true,
    )
  const cabecalho = page.getByRole("banner")

  const falar = cabecalho.getByRole("link", { name: "Falar comigo" })
  await cabecalho.getByRole("link", { exact: true, name: "Projetos" }).click()
  await expect(page).toHaveURL(/\/pt\/projetos$/)
  await falar.click()
  await expect(page).toHaveURL(/\/pt#contato$/)
  expect(await mesmaPagina()).toBe(true)
  // A abertura já vista fica parada: nada nasce escondido esperando o laser.
  await expect(page.locator("html[data-abertura]")).toHaveCount(0)
  await expect(page.locator('[data-mov="retrato"]')).toHaveCSS("opacity", "1")

  // Subiu e clicou de novo, com o endereço já em #contato: desce de novo.
  await page
    .locator('[data-rolagem] [data-slot="scroll-area-viewport"]')
    .evaluate((area) => area.scrollTo({ top: 0 }))
  await falar.click()
  await expect(page.locator("#contato")).toBeInViewport()

  await cabecalho.getByRole("link", { exact: true, name: "en" }).click()
  await expect(page).toHaveURL(/\/en$/)
  expect(await mesmaPagina()).toBe(false)
})

test("caminho desconhecido mostra a 404 no idioma certo", async ({ page }) => {
  const resposta = await page.goto("/en/nao-existe")
  expect(resposta?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This page does not exist.",
  )
})

test("a luz do nome segue o mouse", async ({ page }) => {
  await page.goto("/pt")
  await esperarAbertura(page)
  const nome = page.locator("[data-luz]:visible").first()
  const caixa = await nome.boundingBox()
  if (!caixa) throw new Error("nome sem caixa")
  // Mouse na ponta esquerda do nome: a luz tem de ir para perto de 0%.
  await page.mouse.move(caixa.x + 10, caixa.y + caixa.height / 2)
  await expect
    .poll(async () =>
      parseFloat(
        await nome.evaluate((el) => el.style.getPropertyValue("--luz-x")),
      ),
    )
    .toBeLessThan(10)
})

test("nada fica por cima do retrato da abertura", async ({ page }) => {
  await page.goto("/pt")
  await esperarAbertura(page)
  const retrato = page.locator('img[src*="retrato-nitido"]')
  await expect(retrato).toBeVisible()
  const caixa = await retrato.boundingBox()
  if (!caixa) throw new Error("retrato sem caixa")
  // Rosto e peito: o elemento no topo, nesses pontos, tem de ser a foto.
  // shortcut: elementFromPoint ignora camadas com pointer-events none (os
  // canvas do laser e da fumaça); essas a ordem de camadas garante.
  for (const [fx, fy] of [
    [0.5, 0.2],
    [0.5, 0.45],
    [0.4, 0.6],
  ] as const) {
    const topo = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.getAttribute("src") ?? "",
      { x: caixa.x + caixa.width * fx, y: caixa.y + caixa.height * fy },
    )
    expect(topo, `ponto ${fx},${fy}`).toContain("retrato-nitido")
  }
})

test("a abertura é revelada pela animação, não só pela reserva", async ({
  page,
}) => {
  await page.goto("/pt")
  // A reserva em CSS só troca a visibilidade; a animação marca o <html>.
  await esperarAbertura(page)
})

test("o feixe do laser cai no centro do topo da cabeça", async ({ page }) => {
  await page.goto("/pt")
  await esperarAbertura(page)
  // Lê a transparência da foto na tela e acha o centro do cabelo, no topo.
  const { cabeca, feixe } = await page.evaluate(() => {
    const foto = document.querySelector<HTMLImageElement>(
      'img[src*="retrato-nitido"]',
    )!
    const caixa = foto.getBoundingClientRect()
    const tela = document.createElement("canvas")
    tela.width = foto.naturalWidth
    tela.height = foto.naturalHeight
    const ctx = tela.getContext("2d")!
    ctx.drawImage(foto, 0, 0)
    const { data, width } = ctx.getImageData(0, 0, tela.width, tela.height)
    const opaco = (x: number, y: number) => data[(y * width + x) * 4 + 3]! > 128
    let topo = 0
    while (![...Array(width).keys()].some((x) => opaco(x, topo))) topo++
    const linha = topo + 20
    const xs = [...Array(width).keys()].filter((x) => opaco(x, linha))
    const centro = (xs[0]! + xs.at(-1)!) / 2
    const secao = foto.closest("section")!.getBoundingClientRect()
    return {
      cabeca: caixa.left + centro * (caixa.width / width),
      feixe: secao.left + secao.width / 2,
    }
  })
  expect(Math.abs(cabeca - feixe)).toBeLessThan(6)
})
