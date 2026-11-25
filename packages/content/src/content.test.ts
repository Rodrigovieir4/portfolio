import { describe, expect, it } from "bun:test"

import {
  cases,
  certifications,
  experiences,
  LOCALES,
  profile,
  projects,
  skillGroups,
} from "./index"

/**
 * Os schemas ja validam formato no momento do import. Estes testes cobrem o
 * que o Zod nao alcanca: coerencia entre colecoes e paridade de traducao.
 */

describe("conteudo", () => {
  it("carrega o perfil sem quebrar a validacao", () => {
    expect(profile.name).toBe("Rodrigo Vieira de Sousa")
    expect(profile.socials.some((social) => social.primary)).toBe(true)
  })

  it("nao repete slug entre projetos", () => {
    const slugs = projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("nao repete id entre experiencias nem entre certificados", () => {
    const ids = [
      ...experiences.map((item) => item.id),
      ...certifications.map((item) => item.id),
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("traduz todo resumo de projeto nos tres idiomas", () => {
    for (const project of projects) {
      for (const locale of LOCALES) {
        expect(
          project.summary[locale],
          `${project.slug} em ${locale}`,
        ).toBeTruthy()
      }
    }
  })

  it("mantem os niveis de skill dentro da escala de 1 a 5", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.level).toBeGreaterThanOrEqual(1)
        expect(skill.level).toBeLessThanOrEqual(5)
      }
    }
  })

  it("ordena a linha do tempo da mais recente para a mais antiga", () => {
    const ends = experiences.map((item) => item.end ?? "9999-12")
    expect([...ends].sort().reverse()).toEqual(ends)
  })

  it("liga cada caso a um projeto que existe, sem slug repetido", () => {
    const slugs = cases.map((item) => item.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    const projetos = new Set(projects.map((project) => project.slug))
    for (const item of cases) expect(projetos.has(item.project)).toBe(true)
  })
})
