import { expect, test } from "@playwright/test"

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

test("as páginas de projeto existem nos três idiomas", async ({ page }) => {
  for (const path of [
    "/pt/projetos/esplendido",
    "/en/projects/db-store",
    "/es/proyectos/db-connect",
  ]) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(200)
  }
})
