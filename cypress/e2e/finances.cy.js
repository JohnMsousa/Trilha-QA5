/// <reference types="cypress" />

import { format, prepareLocalStorage } from "../support/utils";

// cy.viewoirt
// arquivos de config
// configs por linha de comando

const { it } = require("mocha");

context("Dev Finances Agilizei", () => {
    // hooks
    // trechos que executam antes e depois do testes
    // befor -> antes de todoso os testes
    // beforEach -> antes de cada teste
    // after -> depois de todos os testes
    // afterEach -> depois de cada teste

    beforeEach(() => {
        cy.visit("https://devfinance-agilizei.netlify.app/", {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win);
            },
        });
    });
    it("Cadastrar entradas", () => {
        cy.get("#transaction .button").click(); // id + classe
        cy.get("#description").type("Mesada"); // id
        cy.get("[name=amount]").type(12); // atributo
        cy.get("[type=date]").type("2024-12-26"); // atributo
        cy.get("button").contains("Salvar").click(); // tipo e valor

        cy.get("#data-table tbody tr").should("have.length", 3);
        // os dados que foram cadastrados
    });

    it("Cadastrar saídas", () => {
        cy.get("#transaction .button").click(); // id + classe
        cy.get("#description").type("Mesada"); // id
        cy.get("[name=amount]").type(-12); // atributo
        cy.get("[type=date]").type("2024-12-26"); // atributo
        cy.get("button").contains("Salvar").click(); // tipo e valor

        cy.get("#data-table tbody tr").should("have.length", 3);
    });

    it("Remover entradas e saídas", () => {
        // estratégia 1: voltar para elemento pai, e avançar para um td img e atributo

        cy.get("td.description")
            .contains("Mesada")
            .parent()
            .find("img[onclick*=remove]")
            .click();

        // estratégia 2: buscar todos os irmãos, e buscar o que tem img + atributo
        cy.get("td.description")
            .contains("Suco Kapo")
            .siblings()
            .children("img[onclick*=remove]")
            .click();

        cy.get("#data-table tbody tr").should("have.length", 0);
    });

    it("Validar saldo com diversas transações", () => {
        // capturar as linhas com as transações e as colunas com valores
        // capturar o texto dessas colunas
        // formatar esses valores das linhas

        // somar os valores de entradas e saidas

        // capturar o texto do total
        // comparar o somatorio de entradas e despesas com o total

        let incomes = 0;
        let expenses = 0;

        cy.get("#data-table tbody tr").each(($el, index, $list) => {
            cy.get($el)
                .find("td.income, td.expense")
                .invoke("text")
                .then((text) => {
                    if (text.includes("-")) {
                        expenses = expenses + format(text);
                    } else {
                        incomes = incomes + format(text);
                    }

                    cy.log(`entradas`, incomes);
                    cy.log(`saidas`, expenses);
                });
        });

        cy.get("#totalDisplay")
            .invoke("text")
            .then((text) => {
                let formattedTotalDisplay = format(text);
                let expectedTotal = incomes + expenses;

                expect(formattedTotalDisplay).to.eq(expectedTotal);
            });
    });
});

// - entender o fluxo manualmente
// - mapear os elementos que vamos interagir
// - descrever as interações com o cypress
// - adicionar asserções que a gente precisa

// - 00:03 sem usar o localstorage
// - 302ms usando o localstorage
