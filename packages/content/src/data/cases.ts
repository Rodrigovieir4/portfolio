/**
 * Casos: histórias reais de engenharia, uma por post da série do LinkedIn.
 *
 * Cada caso pertence a um projeto (`project` é o slug em projects.ts) e entra
 * no ar na data do post (`publishedAt`). Para um caso novo, copie um bloco,
 * troque os textos nos três idiomas e aponte para o projeto certo.
 */
import { type Case, caseSchema, parseCollection } from "../schema"

const raw = [
  {
    slug: "o-codigo-que-le-o-recibo",
    project: "esplendido",
    publishedAt: "2026-11-19",
    stack: ["NestJS", "TypeScript", "PostgreSQL"],
    title: {
      pt: "O código que lê o recibo",
      en: "The code that reads the receipt",
      es: "El código que lee el recibo",
    },
    summary: {
      pt: "Uma foto de talão bastava para liberar o pagamento de um profissional. Fiz o sistema ler o recibo oficial antes de liberar o saldo.",
      en: "A photo of a grocery receipt was enough to release a professional's payment. I made the system read the official receipt before releasing the balance.",
      es: "Una foto de un ticket bastaba para liberar el pago de un profesional. Hice que el sistema leyera el recibo oficial antes de liberar el saldo.",
    },
    problem: {
      pt: "Num marketplace de serviços em Portugal, o profissional precisa emitir um recibo verde antes de receber. O sistema só conferia se existia um ficheiro. Qualquer ficheiro.",
      en: "In a services marketplace in Portugal, professionals must issue an official receipt before getting paid. The system only checked that a file existed. Any file.",
      es: "En un marketplace de servicios en Portugal, el profesional debe emitir un recibo oficial antes de cobrar. El sistema solo comprobaba que existiera un archivo. Cualquier archivo.",
    },
    decision: {
      pt: "O plano era ler o QR obrigatório, mas os recibos reais emitidos no Portal das Finanças não têm QR. A saída foi ler o texto do PDF oficial e convertê-lo para o mesmo formato do QR. O sistema confere destinatário, emissor, estado, valor sem IVA em cêntimos, data e reutilização. Se algo não bate, uma pessoa decide, com o motivo escrito.",
      en: "The plan was to read the mandatory QR code, but real receipts issued on the tax portal have none. The fix was to read the text of the official PDF and turn it into the same format as the QR. The system checks recipient, issuer, status, pre-tax amount in cents, date and reuse. If anything doesn't match, a person decides, with the reason written down.",
      es: "El plan era leer el QR obligatorio, pero los recibos reales emitidos en el portal fiscal no lo tienen. La salida fue leer el texto del PDF oficial y convertirlo al mismo formato del QR. El sistema comprueba destinatario, emisor, estado, importe sin IVA en céntimos, fecha y reutilización. Si algo no cuadra, decide una persona, con el motivo escrito.",
    },
    outcome: {
      pt: "Quando tudo confere, o saldo é liberado sem ninguém tocar, e a máquina nunca recusa sozinha. Imagens acima de 40 megapixels nem são abertas, para um PNG malicioso não derrubar o servidor.",
      en: "When everything matches, the balance is released with no one touching it, and the machine never rejects on its own. Images above 40 megapixels aren't even opened, so a malicious PNG can't take the server down.",
      es: "Cuando todo cuadra, el saldo se libera sin que nadie intervenga, y la máquina nunca rechaza sola. Las imágenes de más de 40 megapíxeles ni se abren, para que un PNG malicioso no tumbe el servidor.",
    },
    lessons: {
      pt: [
        "Teste com documentos reais antes de desenhar o fluxo.",
        'Deixe a máquina dizer "confere" ou "alguém precisa ver". Recusar sozinha é onde mora o prejuízo.',
        "Trate o upload como entrada hostil, inclusive no tamanho.",
      ],
      en: [
        "Test with real documents before designing the flow.",
        'Let the machine say "it matches" or "someone needs to look". Rejecting on its own is where the losses are.',
        "Treat uploads as hostile input, size included.",
      ],
      es: [
        "Prueba con documentos reales antes de diseñar el flujo.",
        'Deja que la máquina diga "cuadra" o "alguien tiene que verlo". Rechazar sola es donde está la pérdida.',
        "Trata la subida de archivos como entrada hostil, también en el tamaño.",
      ],
    },
    metrics: [
      {
        value: "6",
        label: {
          pt: "verificações por recibo",
          en: "checks per receipt",
          es: "verificaciones por recibo",
        },
      },
      {
        value: "40 MP",
        label: {
          pt: "limite de imagem antes da revisão manual",
          en: "image limit before manual review",
          es: "límite de imagen antes de la revisión manual",
        },
      },
    ],
  },
  {
    slug: "duas-pessoas-uma-cota",
    project: "db-store",
    publishedAt: "2026-11-24",
    stack: ["PostgreSQL", "Supabase", "Docker"],
    title: {
      pt: "Duas pessoas, uma cota",
      en: "Two people, one quota",
      es: "Dos personas, una cuota",
    },
    summary: {
      pt: "Sobra um número na rifa e duas pessoas pagam o Pix no mesmo minuto. A disputa é decidida no banco, na confirmação do pagamento.",
      en: "One number is left in the raffle and two people pay in the same minute. The tie is settled in the database, when the payment confirms.",
      es: "Queda un número en la rifa y dos personas pagan en el mismo minuto. La disputa se decide en la base de datos, al confirmar el pago.",
    },
    problem: {
      pt: "Reservar o número ao abrir o checkout prende o número justamente quando há mais procura, porque muita gente abre e desiste.",
      en: "Reserving the number when checkout opens locks it exactly when demand is highest, because many people open checkout and give up.",
      es: "Reservar el número al abrir el checkout lo bloquea justo cuando hay más demanda, porque mucha gente lo abre y desiste.",
    },
    decision: {
      pt: "Abrir o checkout não reserva nada. Quem confirma o pagamento primeiro leva: cada confirmação trava a linha do sorteio no PostgreSQL com SELECT ... FOR UPDATE, e quem pagou e perdeu é estornado na hora para a carteira.",
      en: "Opening checkout reserves nothing. Whoever confirms payment first wins: each confirmation locks the raffle row in PostgreSQL with SELECT ... FOR UPDATE, and whoever paid and lost is refunded to their wallet right away.",
      es: "Abrir el checkout no reserva nada. Quien confirma el pago primero se lo lleva: cada confirmación bloquea la fila del sorteo en PostgreSQL con SELECT ... FOR UPDATE, y quien pagó y perdió recibe el reembolso al instante en su cartera.",
    },
    outcome: {
      pt: "Nenhum número fica preso por quem desistiu. Uma suíte dispara confirmações em paralelo contra um PostgreSQL de verdade, em Docker, a cada pull request.",
      en: "No number stays locked by someone who gave up. A test suite fires confirmations in parallel against a real PostgreSQL, in Docker, on every pull request.",
      es: "Ningún número queda bloqueado por quien desistió. Una suite lanza confirmaciones en paralelo contra un PostgreSQL real, en Docker, en cada pull request.",
    },
    lessons: {
      pt: [
        "Decida onde a disputa acontece e aceite o custo da escolha.",
        "Serialize a decisão no banco, não na aplicação.",
        "Lock testado só em mock não foi testado.",
      ],
      en: [
        "Decide where the race happens and accept the cost of that choice.",
        "Serialize the decision in the database, not in the application.",
        "A lock tested only with mocks hasn't been tested.",
      ],
      es: [
        "Decide dónde ocurre la disputa y acepta el costo de esa elección.",
        "Serializa la decisión en la base de datos, no en la aplicación.",
        "Un bloqueo probado solo con mocks no está probado.",
      ],
    },
    metrics: [
      {
        value: "1",
        label: {
          pt: "vencedor por número, garantido pelo banco",
          en: "winner per number, guaranteed by the database",
          es: "ganador por número, garantizado por la base de datos",
        },
      },
      {
        value: "10",
        label: {
          pt: "compras simultâneas no teste de esgotamento",
          en: "simultaneous purchases in the sell-out test",
          es: "compras simultáneas en la prueba de agotamiento",
        },
      },
    ],
  },
  {
    slug: "o-webhook-que-respondia-ok",
    project: "db-store",
    publishedAt: "2026-12-10",
    stack: ["Pix", "PostgreSQL", "TypeScript"],
    title: {
      pt: "O webhook que respondia ok",
      en: "The webhook that answered OK",
      es: "El webhook que respondía ok",
    },
    summary: {
      pt: "O cliente pagou, o banco confirmou e o dinheiro não apareceu. O webhook respondia sucesso mesmo quando o processamento falhava.",
      en: "The customer paid, the bank confirmed and the money never showed up. The webhook answered success even when processing failed.",
      es: "El cliente pagó, el banco confirmó y el dinero no apareció. El webhook respondía éxito aunque el procesamiento fallara.",
    },
    problem: {
      pt: "Faltava uma credencial no serviço de pagamentos, e o webhook dizia ao gateway que estava tudo certo. O gateway, que reenvia quando recebe erro, simplesmente esquecia o pagamento. Nenhum alarme tocou.",
      en: "The payment service was missing a credential, and the webhook told the gateway everything was fine. The gateway, which retries on error, simply forgot the payment. No alarm went off.",
      es: "Al servicio de pagos le faltaba una credencial, y el webhook le decía al gateway que todo estaba bien. El gateway, que reenvía cuando recibe un error, simplemente olvidaba el pago. Ninguna alarma sonó.",
    },
    decision: {
      pt: "Em falha, o webhook devolve erro de propósito para o gateway reenviar. Cada item fica protegido por status, para reentrega não duplicar crédito; a compra é reconferida antes de expirar; e Pix que chega depois do prazo vira saldo.",
      en: "On failure, the webhook returns an error on purpose so the gateway retries. Each item is guarded by status so a redelivery never credits twice; purchases are rechecked before expiring; and late payments become wallet balance.",
      es: "Ante un fallo, el webhook devuelve un error a propósito para que el gateway reenvíe. Cada ítem queda protegido por estado para que un reenvío no duplique el crédito; la compra se revisa de nuevo antes de expirar; y el pago que llega tarde se convierte en saldo.",
    },
    outcome: {
      pt: "A mesma notificação pode chegar cinco vezes: a primeira credita e as outras quatro não encontram nada para fazer.",
      en: "The same notification can arrive five times: the first one credits and the other four find nothing to do.",
      es: "La misma notificación puede llegar cinco veces: la primera acredita y las otras cuatro no encuentran nada que hacer.",
    },
    lessons: {
      pt: [
        '"200" quer dizer "está resolvido". Só responda isso quando estiver.',
        "Processar pagamento tem de ser idempotente.",
        "Falha silenciosa é a pior falha: faça o erro aparecer.",
      ],
      en: [
        '"200" means "it\'s handled". Only answer that when it is.',
        "Payment processing has to be idempotent.",
        "Silent failure is the worst kind: make the error visible.",
      ],
      es: [
        '"200" significa "está resuelto". Responde eso solo cuando lo esté.',
        "Procesar pagos tiene que ser idempotente.",
        "El fallo silencioso es el peor: haz que el error se vea.",
      ],
    },
  },
  {
    slug: "90-ms-para-3-5-ms",
    project: "db-store",
    publishedAt: "2027-01-05",
    stack: ["PostgreSQL", "Supabase", "RLS"],
    title: {
      pt: "90 ms para 3,5 ms sem tocar na consulta",
      en: "90 ms to 3.5 ms without touching the query",
      es: "De 90 ms a 3,5 ms sin tocar la consulta",
    },
    summary: {
      pt: "Uma consulta caiu de 90,7 ms para 3,5 ms. Não mexi nela: mexi nas políticas de RLS do PostgreSQL.",
      en: "A query dropped from 90.7 ms to 3.5 ms. I didn't touch it: I changed the PostgreSQL RLS policies.",
      es: "Una consulta bajó de 90,7 ms a 3,5 ms. No la toqué: cambié las políticas de RLS de PostgreSQL.",
    },
    problem: {
      pt: "As políticas de RLS chamavam auth.uid() e is_admin() soltas, uma vez por linha candidata. O OR piorava: toda linha alheia pagava uma consulta extra a outra tabela.",
      en: "The RLS policies called auth.uid() and is_admin() bare, once per candidate row. The OR made it worse: every row belonging to someone else paid for an extra lookup in another table.",
      es: "Las políticas de RLS llamaban a auth.uid() e is_admin() sueltas, una vez por fila candidata. El OR lo empeoraba: cada fila ajena pagaba una consulta extra a otra tabla.",
    },
    decision: {
      pt: "Embrulhar as chamadas num subselect, (SELECT auth.uid()), para o planner calcular uma vez por consulta. As 30 políticas foram reescritas a partir do pg_policies, medindo na staging dentro de uma transação com ROLLBACK.",
      en: "Wrap the calls in a subselect, (SELECT auth.uid()), so the planner evaluates them once per query. All 30 policies were rewritten from pg_policies, measured on staging inside a transaction with ROLLBACK.",
      es: "Envolver las llamadas en un subselect, (SELECT auth.uid()), para que el planner las calcule una vez por consulta. Las 30 políticas se reescribieron a partir de pg_policies, midiendo en staging dentro de una transacción con ROLLBACK.",
    },
    outcome: {
      pt: "Cotas de 90,7 para 3,5 ms, compras de 15,4 para 2,0 ms, carteira de 9,4 para 0,5 ms. Depois, 568 de 568 testes passando.",
      en: "Quotas from 90.7 to 3.5 ms, purchases from 15.4 to 2.0 ms, wallet from 9.4 to 0.5 ms. Then 568 of 568 tests passing.",
      es: "Cuotas de 90,7 a 3,5 ms, compras de 15,4 a 2,0 ms, cartera de 9,4 a 0,5 ms. Después, 568 de 568 pruebas pasando.",
    },
    lessons: {
      pt: [
        "RLS roda junto com cada consulta: o custo cresce com as linhas candidatas.",
        "Meça antes e depois, numa transação que você pode desfazer.",
        "Procure auth.uid() solto nas suas políticas.",
      ],
      en: [
        "RLS runs with every query: the cost grows with the candidate rows.",
        "Measure before and after, inside a transaction you can roll back.",
        "Look for bare auth.uid() calls in your policies.",
      ],
      es: [
        "RLS se ejecuta con cada consulta: el costo crece con las filas candidatas.",
        "Mide antes y después, dentro de una transacción que puedas deshacer.",
        "Busca auth.uid() suelto en tus políticas.",
      ],
    },
    metrics: [
      {
        value: "3,5 ms",
        label: {
          pt: "cotas, antes 90,7 ms",
          en: "quotas, down from 90.7 ms",
          es: "cuotas, antes 90,7 ms",
        },
      },
      {
        value: "2,0 ms",
        label: {
          pt: "compras, antes 15,4 ms",
          en: "purchases, down from 15.4 ms",
          es: "compras, antes 15,4 ms",
        },
      },
      {
        value: "0,5 ms",
        label: {
          pt: "carteira, antes 9,4 ms",
          en: "wallet, down from 9.4 ms",
          es: "cartera, antes 9,4 ms",
        },
      },
      {
        value: "568",
        label: {
          pt: "testes passando depois da mudança",
          en: "tests passing after the change",
          es: "pruebas pasando después del cambio",
        },
      },
    ],
  },
  {
    slug: "o-null-que-desfazia-o-sorteio",
    project: "db-store",
    publishedAt: "2027-01-07",
    stack: ["PostgreSQL", "SQL"],
    title: {
      pt: "O NULL que desfazia o sorteio",
      en: "The NULL that undid the raffle",
      es: "El NULL que deshacía el sorteo",
    },
    summary: {
      pt: "Um emblema decorativo derrubava um sorteio inteiro. A culpa era de um NULL numa conta de data.",
      en: "A decorative badge brought down an entire raffle. The culprit was a NULL in a date calculation.",
      es: "Un emblema decorativo tumbaba un sorteo entero. La culpa era de un NULL en un cálculo de fecha.",
    },
    problem: {
      pt: "Para emblemas permanentes, a duração é NULL, e NOW() + (duracao_dias || ' days') vira NULL. A coluna de expiração não aceita NULL, e a transação do sorteio inteira voltava atrás.",
      en: "For permanent badges the duration is NULL, so NOW() + (duracao_dias || ' days') becomes NULL. The expiry column rejects NULL, and the whole raffle transaction rolled back.",
      es: "Para emblemas permanentes la duración es NULL, y NOW() + (duracao_dias || ' days') se vuelve NULL. La columna de expiración no acepta NULL, y toda la transacción del sorteo se revertía.",
    },
    decision: {
      pt: "Reproduzi o erro 23502 na staging e troquei a mesma conta, repetida em três lugares, por uma única função de expiração. Depois repeti o giro simulado.",
      en: "I reproduced error 23502 on staging and replaced the same calculation, repeated in three places, with a single expiry function. Then I re-ran the simulated spin.",
      es: "Reproduje el error 23502 en staging y reemplacé el mismo cálculo, repetido en tres lugares, por una sola función de expiración. Después repetí el giro simulado.",
    },
    outcome: {
      pt: "O sorteio nunca ficou pela metade, porque a regra mora numa transação. E um detalhe de gamificação deixou de bloquear a parte mais importante do produto.",
      en: "The raffle was never left half done, because the rule lives in a transaction. And a gamification detail no longer blocks the most important part of the product.",
      es: "El sorteo nunca quedó a medias, porque la regla vive en una transacción. Y un detalle de gamificación dejó de bloquear la parte más importante del producto.",
    },
    lessons: {
      pt: [
        "NULL não é zero nem vazio.",
        "Toda conta com coluna opcional tem um caminho que você ainda não testou.",
        "A mesma regra em três lugares acaba quebrando em um deles.",
      ],
      en: [
        "NULL is neither zero nor empty.",
        "Every calculation with an optional column has a path you haven't tested yet.",
        "The same rule in three places eventually breaks in one of them.",
      ],
      es: [
        "NULL no es cero ni vacío.",
        "Todo cálculo con una columna opcional tiene un camino que aún no probaste.",
        "La misma regla en tres lugares termina rompiéndose en uno de ellos.",
      ],
    },
    metrics: [
      {
        value: "3",
        label: {
          pt: "cópias da regra trocadas por uma função",
          en: "copies of the rule replaced by one function",
          es: "copias de la regla reemplazadas por una función",
        },
      },
    ],
  },
  {
    slug: "o-sorteio-que-girou-sozinho",
    project: "db-store",
    publishedAt: "2027-01-14",
    stack: ["PostgreSQL", "Vercel", "Trigger.dev"],
    title: {
      pt: "O sorteio que girou sozinho",
      en: "The raffle that spun by itself",
      es: "El sorteo que giró solo",
    },
    summary: {
      pt: "Dia de deploy grande, tudo ensaiado, e o sistema girou um sorteio sozinho em produção. O caminho de volta já estava pronto.",
      en: "Big deploy day, everything rehearsed, and the system spun a raffle by itself in production. The way back was already ready.",
      es: "Día de deploy grande, todo ensayado, y el sistema giró un sorteo solo en producción. El camino de vuelta ya estaba listo.",
    },
    problem: {
      pt: "O ensaio copiou o schema de produção, aplicou 46 migrations e conferiu delta zero contra a staging. Provou que a mudança de banco era segura, mas não como a automação se comportaria com rifas reais.",
      en: "The rehearsal copied the production schema, applied 46 migrations and confirmed zero drift against staging. It proved the database change was safe, but not how the automation would behave with real raffles.",
      es: "El ensayo copió el schema de producción, aplicó 46 migrations y confirmó cero diferencias contra staging. Probó que el cambio de base de datos era seguro, pero no cómo se comportaría la automatización con rifas reales.",
    },
    decision: {
      pt: "Os apps voltaram no mesmo dia ao código estável de duas semanas antes. O banco ficou no schema novo, que era aditivo e compatível, e a funcionalidade seguiu sendo corrigida na staging.",
      en: "The apps went back the same day to the stable code from two weeks earlier. The database stayed on the new schema, which was additive and compatible, and the feature kept being fixed on staging.",
      es: "Las apps volvieron el mismo día al código estable de dos semanas antes. La base de datos quedó en el schema nuevo, que era aditivo y compatible, y la funcionalidad siguió corrigiéndose en staging.",
    },
    outcome: {
      pt: "Hoje o giro automático e a transmissão ficam atrás de uma chave única, desligada. Para religar, a regra escrita exige provar antes em produção com uma rifa de teste.",
      en: "Today automatic spins and streaming sit behind a single switch, turned off. Turning it back on requires proving it first in production with a test raffle.",
      es: "Hoy el giro automático y la transmisión están detrás de un único interruptor, apagado. Para volver a encenderlo, la regla escrita exige probarlo antes en producción con una rifa de prueba.",
    },
    lessons: {
      pt: [
        "Ensaiar reduz o risco. Não zera.",
        "Decida antes do deploy como voltar atrás.",
        "Migrations aditivas deixam o código voltar sem mexer no banco.",
      ],
      en: [
        "Rehearsing reduces risk. It doesn't remove it.",
        "Decide how to roll back before you deploy.",
        "Additive migrations let the code go back without touching the database.",
      ],
      es: [
        "Ensayar reduce el riesgo. No lo elimina.",
        "Decide antes del deploy cómo volver atrás.",
        "Las migrations aditivas permiten volver con el código sin tocar la base de datos.",
      ],
    },
    metrics: [
      {
        value: "46",
        label: {
          pt: "migrations ensaiadas numa cópia de produção",
          en: "migrations rehearsed on a copy of production",
          es: "migrations ensayadas en una copia de producción",
        },
      },
    ],
  },
]

export const cases: Case[] = parseCollection(caseSchema, {
  items: raw,
  source: "src/data/cases.ts",
}).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))

export function caseBySlug(slug: string): Case | undefined {
  return cases.find((item) => item.slug === slug)
}
