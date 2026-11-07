import type { CargoLocale } from "./seo";
import type { CargoSeoPageContent } from "./seo-pages";

// TODO: Have a native Kinyarwanda speaker review the new localized copy before publication.
export const cargoHelpPage: Record<CargoLocale, CargoSeoPageContent> = {
  en: {
    title: "Tembera Cargo Help and FAQs | Rwanda",
    description:
      "Answers about sending goods, quotes, pickup choices, handover and tracking with Tembera Cargo.",
    heading: "How do I send and track goods with Tembera Cargo?",
    summary:
      "Tembera Cargo arranges door-to-door goods delivery across Rwanda. Enter the collection and destination locations and package details, review the available fulfillment options and shipment-specific quote, then confirm and track the shipment with its code. Check the app for current availability and instructions.",
    visual: "faq",
    sections: [
      {
        heading: "The Tembera Cargo flow, from a real shipment to delivery",
        paragraphs: [
          "1. Route: choose the actual origin and destination locations. 2. Cargo: enter the category, weight, size class, description, item count and whether the item is fragile. 3. Quote: compare the options returned for that route and package. 4. Recipient: enter the recipient name and phone, then complete phone confirmation when requested. 5. Handover: choose home pickup or station drop-off, and address delivery or station collection where offered. 6. Confirmation: keep the shipment tracking code and share it only with the intended recipient.",
          "The tracking record can move through created, picked up, at station, in transit, delivered or cancelled. The tracking page shows the latest available event and may show an estimated delivery time when the service has one; it is not a promise of a universal timetable.",
          "At delivery, Tembera Cargo uses a six-digit delivery code to verify the handover. Tembera Cargo guarantees 100% compensation of the sender-declared cargo value when cargo is lost, damaged or not delivered because of a service-related issue, subject to the applicable terms.",
          "Last updated: 7 November 2026. This page does not publish fixed nationwide prices or unverified package-acceptance rules. Current options come from the shipment flow.",
        ],
      },
      {
        heading: "If the shipment does not go as expected",
        paragraphs: [
          "For lost, damaged or undelivered cargo, report the claim within 48 hours of the expected delivery or the incident becoming known. Keep the tracking code and contact Tembera Cargo through the published contact page. Tembera Cargo investigates, reviews the shipment records and holds responsible parties accountable. Eligible claims are paid at 100% of the sender-declared cargo value. Wrong addresses and unreachable recipients should also be reported promptly, but compensation depends on the applicable terms and the facts of the incident.",
        ],
      },
      {
        heading: "What the quote does and does not mean",
        paragraphs: [
          "A quote is calculated for the locations and cargo details you entered. It is not a nationwide tariff and should not be copied to another package. If you change the route or package after receiving a quote, request a new quote before confirming.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is Tembera Cargo?",
        answer:
          "It is a goods-delivery service across Rwanda by Nyxarith, with door-to-door delivery and shipment tracking.",
      },
      {
        question: "Where does Tembera Cargo deliver?",
        answer:
          "It serves delivery across Rwanda. Enter the exact origin and destination in the app to check current availability for your shipment.",
      },
      {
        question: "How do I send a package?",
        answer:
          "Enter the pickup and destination details, provide the package information requested, review the available options and quote, then follow the app instructions to confirm.",
      },
      {
        question: "Can I arrange pickup from an address?",
        answer:
          "Home pickup is available as an option where it is shown for the shipment. Check the choices returned by the app.",
      },
      {
        question: "Can I drop a package at a station?",
        answer:
          "Station drop-off is available where it is shown for the shipment. Review the app before confirming.",
      },
      {
        question: "Can the recipient collect a package at a station?",
        answer:
          "Station collection is one of the delivery choices where it is offered for the shipment.",
      },
      {
        question: "How is the delivery price calculated?",
        answer:
          "Enter the shipment locations and package details, then review the quote shown for that specific shipment before confirming.",
      },
      {
        question: "Does Tembera Cargo have one fixed price for Rwanda?",
        answer:
          "No nationwide flat price is stated. The app shows a shipment-specific quote based on the details entered.",
      },
      {
        question: "How do I track a shipment?",
        answer:
          "Enter the shipment tracking code on the official Tembera Cargo tracking page to check its latest available status.",
      },
      {
        question: "Can the recipient track the shipment?",
        answer:
          "The recipient can use the tracking code to check the latest status. Share it privately with the intended recipient.",
      },
      {
        question: "Should I share my tracking code publicly?",
        answer:
          "No. A tracking code can reveal shipment information; share it only with the intended recipient.",
      },
      {
        question: "Does Tembera Cargo promise a delivery time?",
        answer:
          "No fixed delivery time is promised on this page. Review any estimate shown for your shipment in the app.",
      },
      {
        question: "How does package handover work?",
        answer:
          "Follow the pickup or drop-off and delivery or collection instructions shown for your shipment. The service uses existing infrastructure and a tracked shipment flow.",
      },
      {
        question: "Can I send any kind of item?",
        answer:
          "This page does not list universal acceptance rules. Enter the shipment details in the app and follow the package options and instructions it provides.",
      },
      {
        question: "Can Tembera Cargo deliver between my two locations?",
        answer:
          "Enter the exact pickup and destination locations to see whether a delivery option is available for that shipment.",
      },
      {
        question: "Can I change a shipment after confirming it?",
        answer:
          "This page does not promise that a confirmed shipment can be changed. Check the actions available in the app for your shipment.",
      },
      {
        question: "Who operates Tembera Cargo?",
        answer:
          "Tembera Cargo is operated by Nyxarith Private Limited Company, registered in Rwanda.",
      },
      {
        question: "Where can I get current shipment instructions?",
        answer:
          "Use the official Tembera Cargo app for current options, quote details, confirmation steps and tracking.",
      },
    ],
  },
  rw: {
    title: "Ubufasha n’Ibibazo kuri Tembera Cargo",
    description:
      "Ibisubizo ku kohereza imizigo, ibiciro, gufatira, kuyishyikiriza no kuyikurikirana muri Tembera Cargo.",
    heading: "Nohereza nte kandi nkurikirana nte imizigo muri Tembera Cargo?",
    summary:
      "Tembera Cargo iteganya kugeza ibicuruzwa ku rugi mu Rwanda. Andika aho bifatirwa n’aho bijyanwa n’amakuru y’imizigo, urebe amahitamo n’igiciro byatanzwe kuri iyo mizigo, wemeze hanyuma uyikurikirane ukoresheje kode. Reba muri porogaramu amahitamo n’amabwiriza agezweho.",
    visual: "faq",
    sections: [
      {
        heading: "Uko umuzigo wa Tembera Cargo ugenda kugeza ugeze ku wakira",
        paragraphs: [
          "1. Inzira: hitamo aho imizigo ituruka n’aho ijyanwa. 2. Imizigo: andika ubwoko, uburemere, ingano, ibisobanuro, umubare n’uko yameneka. 3. Igiciro: gereranya amahitamo agaruka kuri iyo nzira n’iyo mizigo. 4. Uyakira: andika izina na telefone, ukore kwemeza telefone igihe bisabwe. 5. Gushyikiriza: hitamo gufatira mu rugo cyangwa gutanga kuri sitasiyo, n’uko uyakira ayigezwaho cyangwa ayifatira kuri sitasiyo igihe bihari. 6. Kwemeza: bika kode yo gukurikirana kandi uyisangize uyakira ugenewe gusa.",
          "Amakuru y’imizigo ashobora kunyura kuri created, picked_up, at_station, in_transit, delivered cyangwa cancelled. Paji yo gukurikirana yerekana event iheruka kandi ishobora kwerekana igihe giteganyijwe iyo serivisi igifite; ntabwo ari isezerano ry’igihe kimwe ku mizigo yose.",
          "Mu gihe cyo kuyishyikiriza, Tembera Cargo ikoresha kode y’imibare itandatu yo kwemeza ko imizigo igeze ku uyakira. Iyo imizigo ibuze, yangiritse cyangwa itagejejwe kubera ikibazo cya serivisi, Tembera Cargo yishyura 100% by’agaciro uwohereje yatangaje, hakurikijwe amategeko akurikizwa.",
          "Iheruka kuvugururwa: 7 Ugushyingo 2026. Uru rupapuro ntirutangaza igiciro kimwe ku gihugu cyose cyangwa amategeko y’ibyemewe ataragenzurwa. Amahitamo agezweho aboneka mu buryo bwo kohereza.",
        ],
      },
      {
        heading: "Iyo imizigo itagenze neza",
        paragraphs: [
          "Niba imizigo ibuze, yangiritse cyangwa itagejejwe, menyesha Tembera Cargo mu masaha 48 uhereye igihe yagombaga kugerera cyangwa igihe ikibazo cyamenyekanye. Bika kode yo gukurikirana maze uvugane na Tembera Cargo kuri paji y’itumanaho. Tembera Cargo isuzuma, ireba inyandiko z’imizigo kandi ikabaza ababigizemo uruhare. Ibirego byujuje ibisabwa byishyurwa 100% by’agaciro uwohereje yatangaje. Aderesi itari yo, uyakira utabonetse cyangwa ikibazo cy’umushoferi nabyo bigomba gutangwaho amakuru vuba; indishyi zishingira ku mategeko n’ibyabaye.",
        ],
      },
      {
        heading: "Icyo igiciro cyatanzwe gisobanura",
        paragraphs: [
          "Igiciro gishingira ku hantu n’amakuru y’imizigo watanze. Ntabwo ari igiciro kimwe ku Rwanda kandi ntigomba gukoreshwa ku yindi mizigo. Nuhindura inzira cyangwa amakuru y’imizigo, saba igiciro gishya mbere yo kwemeza.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tembera Cargo ni iki?",
        answer:
          "Ni serivisi ya Nyxarith yo gutwara ibicuruzwa mu Rwanda, ikabigeza ku rugi kandi igafasha kubikurikirana.",
      },
      {
        question: "Tembera Cargo igeza he?",
        answer:
          "Itanga serivisi yo gutwara ibicuruzwa mu Rwanda. Andika aho bivuye n’aho bijyanwa muri porogaramu urebe amahitamo ahari.",
      },
      {
        question: "Nohereza nte ikintu?",
        answer:
          "Andika aho gifatirwa n’aho kijyanwa, utange amakuru yacyo asabwa, urebe amahitamo n’igiciro, hanyuma ukurikize amabwiriza yo kwemeza.",
      },
      {
        question: "Nshobora gusaba ko imizigo ifatirwa ku rugo?",
        answer:
          "Gufatira ku rugo biraboneka iyo ari amahitamo agaragazwa ku mizigo yawe. Reba amahitamo muri porogaramu.",
      },
      {
        question: "Nshobora gushyikiriza imizigo kuri sitasiyo?",
        answer:
          "Kuyishyikiriza kuri sitasiyo biraboneka iyo bigaragajwe nk’amahitamo ku mizigo yawe. Banza urebe muri porogaramu.",
      },
      {
        question: "Uyakira ashobora gufatira imizigo kuri sitasiyo?",
        answer:
          "Kufatira kuri sitasiyo ni bumwe mu buryo bwo kwakira imizigo iyo butanzwe kuri iyo mizigo.",
      },
      {
        question: "Igiciro cyo gutwara kibarwa gite?",
        answer:
          "Andika aho imizigo ituruka n’aho ijyanwa n’amakuru yayo, urebe igiciro cyatanzwe kuri iyo mizigo mbere yo kwemeza.",
      },
      {
        question: "Tembera Cargo ifite igiciro kimwe mu Rwanda hose?",
        answer:
          "Oya. Nta giciro kimwe gihoraho gitangazwa; porogaramu itanga igiciro gishingiye ku makuru y’imizigo.",
      },
      {
        question: "Nakurikirana nte imizigo?",
        answer:
          "Andika kode yo gukurikirana ku rubuga rwemewe rwa Tembera Cargo urebe amakuru aheruka.",
      },
      {
        question: "Uyakira ashobora gukurikirana imizigo?",
        answer:
          "Uyakira ashobora gukoresha kode yo gukurikirana arebe aho igeze. Yisangize uyakira ugenewe gusa.",
      },
      {
        question: "Nshyira kode yo gukurikirana ahagaragara?",
        answer: "Oya. Kode ishobora kwerekana amakuru y’imizigo; yisangize uyakira ugenewe gusa.",
      },
      {
        question: "Tembera Cargo isezeranya kugeza imizigo ryari?",
        answer:
          "Nta gihe gihoraho cyo kugeza gitangazwa hano. Reba ikigereranyo kigaragara muri porogaramu ku mizigo yawe.",
      },
      {
        question: "Imizigo ishyikirizwa ite?",
        answer:
          "Kurikiza amabwiriza yo gufatira cyangwa gushyikiriza n’ayo kugeza cyangwa kwakira agaragara ku mizigo yawe. Serivisi ikoresha ibikorwa remezo bisanzwe n’uburyo bwo gukurikirana.",
      },
      {
        question: "Nshobora kohereza ikintu icyo ari cyo cyose?",
        answer:
          "Uru rupapuro ntirutangaza amategeko rusange y’ibyemewe. Andika amakuru y’imizigo muri porogaramu, ukurikize amahitamo n’amabwiriza igaragaza.",
      },
      {
        question: "Tembera Cargo ishobora kugeza imizigo hagati y’aho hantu habiri?",
        answer:
          "Andika aho ifatirwa n’aho ijyanwa kugira ngo urebe niba hari uburyo bwo kuyitwara.",
      },
      {
        question: "Nshobora guhindura amakuru y’imizigo maze kuyemeza?",
        answer:
          "Uru rupapuro ntirusezeranya ko amakuru y’imizigo yemejwe ashobora guhindurwa. Reba amahitamo agaragara muri porogaramu ku mizigo yawe.",
      },
      {
        question: "Ni nde ukora Tembera Cargo?",
        answer:
          "Tembera Cargo ikorwa na Nyxarith Private Limited Company, ikigo cyanditswe mu Rwanda.",
      },
      {
        question: "Nabona he amabwiriza agezweho y’imizigo?",
        answer:
          "Koresha porogaramu ya Tembera Cargo urebe amahitamo, igiciro, amabwiriza yo kwemeza no gukurikirana.",
      },
    ],
  },
};
