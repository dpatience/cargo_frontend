import { absoluteSiteUrl, type CargoLocale } from "./seo";
import { cargoHelpPage } from "./seo-help-pages";

export type CargoSeoPageContent = {
  title: string;
  description: string;
  heading: string;
  summary: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  steps?: Array<{ name: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
  noIndex?: boolean;
};

type LocalizedCargoPage = {
  slug: string;
  en: CargoSeoPageContent;
  rw: CargoSeoPageContent;
};

const pairFaqs = {
  en: [
    {
      question: "Is a particular departure time guaranteed on this route?",
      answer:
        "No fixed departure time is stated on this guide. Enter the exact pickup and delivery locations in Tembera Cargo to see current options before confirming.",
    },
    {
      question: "How is the delivery price for this route calculated?",
      answer:
        "Enter the shipment details in Tembera Cargo and review the quote shown for the selected route and delivery option before confirming.",
    },
  ],
  rw: [
    {
      question: "Ese iyi nzira iba ifite isaha ntarengwa yo kugenda?",
      answer:
        "Iyi paji ntigaragaza isaha ntarengwa yo kugenda. Andika aho imizigo ifatirwa n'aho ijyanwa muri Tembera Cargo kugira ngo urebe amahitamo ahari mbere yo kwemeza.",
    },
    {
      question: "Igiciro cyo gutwara kuri iyi nzira kibarwa gite?",
      answer:
        "Andika amakuru y'imizigo muri Tembera Cargo, urebe igiciro cyatanzwe ku nzira no ku mahitamo yo kugeza mbere yo kwemeza.",
    },
  ],
} as const;

const cityPairs = [
  ["kigali", "Musanze"],
  ["kigali", "Huye"],
  ["kigali", "Rubavu"],
  ["kigali", "Rusizi"],
] as const;

function routePage(locale: CargoLocale, from: string, to: string): CargoSeoPageContent {
  if (locale === "en") {
    return {
      title: `Cargo delivery from ${from} to ${to} | Tembera Cargo`,
      description: `Arrange cargo delivery from ${from} to ${to} in Rwanda. Review a shipment-specific quote, available handover options and tracking with Tembera Cargo.`,
      heading: `Send cargo from ${from} to ${to}`,
      summary: `Tembera Cargo helps you arrange goods delivery from ${from} to ${to}. Enter the collection and destination details, add the package information, then review the available delivery options and the quote before confirming. Use the shipment tracking code to check its status. Current availability and prices are confirmed in the app.`,
      steps: [
        {
          name: "Enter the route",
          text: `Set ${from} as the origin and ${to} as the destination, using the exact collection and delivery locations.`,
        },
        {
          name: "Describe the shipment",
          text: "Provide the package and sender or recipient details requested in the form so the quote matches the shipment.",
        },
        {
          name: "Review available options",
          text: "Compare the current quote and handover choices shown for the shipment before confirming.",
        },
        {
          name: "Track the shipment",
          text: "Keep the tracking code and share it privately with the intended recipient to check the latest status.",
        },
      ],
      sections: [
        {
          heading: `How delivery from ${from} to ${to} works`,
          paragraphs: [
            `Set ${from} as the origin and ${to} as the destination in the shipment form. Tembera Cargo uses the locations and package details you provide to request a current delivery quote.`,
            "Choose the pickup or drop-off and delivery or collection option shown for your shipment. The available options, quoted price and any delivery estimate are shown in the flow when available; this guide does not promise a fixed schedule or rate.",
          ],
        },
        {
          heading: "Handover and tracking",
          paragraphs: [
            "Provide the sender and recipient details requested by the app, confirm the shipment, and share its tracking code only with the intended recipient. Track the shipment with that code to view its latest available status.",
          ],
        },
      ],
      faqs: [...pairFaqs.en],
    };
  }

  return {
    title: `Kohereza imizigo kuva ${from} ujya ${to} | Tembera Cargo`,
    description: `Teganya kohereza imizigo kuva ${from} ujya ${to} mu Rwanda. Reba igiciro cy'iyo mizigo, uburyo bwo kuyishyikiriza n'uko wayikurikirana muri Tembera Cargo.`,
    heading: `Kohereza imizigo kuva ${from} ujya ${to}`,
    summary: `Tembera Cargo igufasha guteganya gutwara ibicuruzwa kuva ${from} ujya ${to}. Andika aho bifatirwa n'aho bijyanwa, wongere amakuru yabyo, hanyuma urebe amahitamo yo kubigeza n'igiciro mbere yo kwemeza. Kode yo gukurikirana igufasha kureba aho imizigo igeze. Amahitamo n'ibiciro by'ubu byemezwa muri porogaramu.`,
    steps: [
      {
        name: "Andika inzira",
        text: `Hitamo ${from} aho imizigo ituruka na ${to} aho ijyanwa, wandike ahantu nyaho izafatirwa n'aho izagezwa.`,
      },
      {
        name: "Sobanura imizigo",
        text: "Tanga amakuru y'ibicuruzwa n'ay'uwabitanga cyangwa uyakira asabwa kugira ngo igiciro gihure n'iyo mizigo.",
      },
      {
        name: "Reba amahitamo ahari",
        text: "Gereranya igiciro n'uburyo bwo gushyikiriza imizigo bigaragara mbere yo kwemeza.",
      },
      {
        name: "Kurikirana imizigo",
        text: "Bika kode yo gukurikirana kandi uyisangize uyakira ugenewe gusa kugira ngo arebe amakuru aheruka.",
      },
    ],
    sections: [
      {
        heading: `Uko gutwara imizigo kuva ${from} ujya ${to} bikorwa`,
        paragraphs: [
          `Hitamo ${from} nk'aho imizigo ituruka na ${to} nk'aho ijyanwa. Tembera Cargo isaba igiciro gishingiye ku hantu n'amakuru y'imizigo watanze.`,
          "Hitamo uburyo bwo gufata cyangwa gutanga imizigo n'uburyo yo kwakira cyangwa kugeza bugaragara ku mizigo yawe. Amahitamo, igiciro n'igihe cyo kuyigeza bigaragara muri porogaramu igihe bihari; iyi paji ntitanga isaha cyangwa igiciro gihoraho.",
        ],
      },
      {
        heading: "Gushyikiriza no gukurikirana imizigo",
        paragraphs: [
          "Tanga amakuru y'uwatanze n'uyakira asabwa muri porogaramu, wemeze kohereza, uhe kode uyakira ugenewe gusa. Koresha kode urebe amakuru aheruka y'imizigo.",
        ],
      },
    ],
    faqs: [...pairFaqs.rw],
  };
}

const corePages: Record<CargoLocale, Record<string, CargoSeoPageContent>> = {
  en: {
    cargo: {
      title: "Tembera Cargo Rwanda | Delivery Across Rwanda",
      description:
        "Explore Tembera Cargo door-to-door goods delivery across Rwanda, including route quotes, pickup choices and shipment tracking.",
      heading: "Cargo delivery across Rwanda with Tembera",
      summary:
        "Tembera Cargo is Nyxarith's goods-delivery service for sending packages across Rwanda. Enter the collection and destination locations, describe the cargo, compare the options and quote shown for your shipment, then track it with its code.",
      sections: [
        {
          heading: "Plan the shipment before you confirm",
          paragraphs: [
            "The app requests origin, destination and package details before calculating a quote. Review the delivery options and price shown for that shipment; rates are not a single nationwide flat price.",
            "Depending on the options shown, a sender can arrange home pickup or station drop-off, and a recipient can choose address delivery or station collection.",
          ],
        },
        {
          heading: "Keep the tracking code private",
          paragraphs: [
            "After creating a shipment, use its tracking code to check the latest status. Share the code only with the intended recipient because it can reveal shipment information.",
          ],
        },
      ],
      faqs: [
        {
          question: "Where does Tembera Cargo deliver?",
          answer:
            "Tembera Cargo serves goods delivery across Rwanda. Enter the exact origin and destination in the app to check the options currently available for your shipment.",
        },
        {
          question: "Can I see the price before sending cargo?",
          answer:
            "Yes. Enter the route and package details to request a quote, then review the displayed delivery option and price before confirming.",
        },
        {
          question: "Can I track a package?",
          answer:
            "Yes. Use the tracking code for the shipment to check its latest available status.",
        },
      ],
    },
    "how-it-works": {
      title: "How Tembera Cargo Delivery Works | Rwanda",
      description:
        "See how to enter a route, describe a package, review delivery options, arrange handover and track a Tembera Cargo shipment.",
      heading: "How does Tembera Cargo work?",
      summary:
        "Tembera Cargo arranges goods delivery across Rwanda through a guided shipment flow. Enter the collection and delivery locations, provide package and recipient details, review the generated quote and available handover choices, confirm the shipment and use its tracking code for status updates.",
      sections: [
        {
          heading: "Enter the shipment route and package details",
          paragraphs: [
            "Choose pickup and destination locations, then enter the cargo category and the package details requested in the form. Accurate information helps the app return options for the shipment you intend to send.",
          ],
        },
        {
          heading: "Choose how each end hands over the package",
          paragraphs: [
            "The app supports sender home pickup or station drop-off and receiver address delivery or station collection. Availability of the options depends on the shipment details and locations entered.",
          ],
        },
        {
          heading: "Review, confirm and follow the shipment",
          paragraphs: [
            "Review the quote before confirmation. After the shipment is created, keep its tracking code and use it to check the latest status.",
          ],
        },
      ],
      faqs: [
        {
          question: "Do I see a quote before I confirm?",
          answer:
            "Yes. The shipment flow requests a quote and shows available delivery options before you confirm the shipment.",
        },
        {
          question: "Can the recipient collect the package?",
          answer:
            "Station collection is one of the receiver fulfillment options where it is available for the shipment.",
        },
      ],
    },
    pricing: {
      title: "Tembera Cargo Pricing | Get a Shipment Quote",
      description:
        "Tembera Cargo shows a shipment-specific delivery quote after you enter locations and package details. Review the current price before confirming.",
      heading: "How is Tembera Cargo delivery priced?",
      summary:
        "Tembera Cargo calculates a quote for the shipment details you enter rather than publishing one fixed nationwide delivery price. Add the route and package information, review the delivery options and price returned for that shipment, and confirm only if the displayed choice suits you.",
      sections: [
        {
          heading: "What to enter for an accurate quote",
          paragraphs: [
            "The quote flow uses the origin and destination and the cargo details entered, including category and package information. Enter complete, accurate details so the quote applies to the shipment you plan to send.",
          ],
        },
        {
          heading: "Compare the available handover choices",
          paragraphs: [
            "Pickup or drop-off and delivery or station collection can affect which options are available. The app presents a quote for the selected shipment option before the confirmation step.",
          ],
        },
        {
          heading: "Prices are confirmed in the app",
          paragraphs: [
            "This page does not list a universal rate card. Check the current quote in Tembera Cargo for your actual locations and package details before confirming.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does Tembera Cargo have one flat price for Rwanda?",
          answer:
            "This page does not claim a single flat price. Enter the shipment details in the app to get the quote for your route and delivery option.",
        },
        {
          question: "When will I see my delivery price?",
          answer:
            "The shipment flow displays available options and a quote before you confirm the shipment.",
        },
      ],
    },
    "safety-and-trust": {
      title: "Safer Package Handover and Tracking | Tembera Cargo",
      description:
        "Learn how Tembera Cargo organizes package details, sender and recipient handover choices, and shipment-code tracking across Rwanda.",
      heading: "How does Tembera Cargo help make package handover clearer?",
      summary:
        "Tembera Cargo gives senders a structured way to enter a shipment, select available pickup and delivery arrangements, and follow its status with a tracking code. Use the shipment flow and share tracking details only with the intended recipient; do not assume insurance or a delivery guarantee unless explicitly offered.",
      sections: [
        {
          heading: "Record the shipment and recipient details",
          paragraphs: [
            "The app collects the shipment, location and recipient information needed to create a delivery request. Check these details before confirming so the sender and recipient are clear.",
          ],
        },
        {
          heading: "Select an available handover option",
          paragraphs: [
            "The sender can choose home pickup or station drop-off, and the receiver can choose address delivery or station collection where those options are offered.",
          ],
        },
        {
          heading: "Protect the shipment tracking code",
          paragraphs: [
            "A tracking code can disclose shipment status. Give it only to the person who should receive the package and avoid posting it publicly.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does a tracking code show shipment status?",
          answer:
            "Yes. The code is used to check the latest available shipment status, so share it only with the intended recipient.",
        },
        {
          question: "Does Tembera Cargo guarantee delivery or insure every item?",
          answer:
            "Do not assume a delivery guarantee or insurance from this page. Review the terms and conditions that apply to your shipment before confirming.",
        },
      ],
    },
    "track-a-package": {
      title: "Track a Package in Rwanda | Tembera Cargo",
      description:
        "Use your Tembera Cargo tracking code to check the latest available status of a shipment moving across Rwanda.",
      heading: "How do I track a Tembera Cargo package?",
      summary:
        "Open Tembera Cargo's tracking page and enter the shipment's tracking code to see its latest available status. The code is private shipment information: use the code provided for your delivery and share it only with the intended recipient.",
      sections: [
        {
          heading: "Find the code for your shipment",
          paragraphs: [
            "Use the tracking code associated with the shipment. If you are the recipient, ask the sender to share the correct code privately.",
          ],
        },
        {
          heading: "Check the latest status",
          paragraphs: [
            "Open the tracking form, enter the code and submit it. The app reports the status available for that shipment; this page does not expose individual shipment records.",
          ],
        },
        {
          heading: "Do not post tracking details publicly",
          paragraphs: [
            "Anyone with a shipment code may be able to view related tracking information. Keep it out of public messages and share it only with the intended recipient.",
          ],
        },
      ],
      faqs: [
        {
          question: "Where do I enter the tracking code?",
          answer: "Open the Tembera Cargo tracking page and enter the code in the tracking form.",
        },
        {
          question: "Can I track a shipment without its code?",
          answer:
            "The public tracking flow requires the shipment tracking code. Ask the sender for the correct code if you do not have it.",
        },
      ],
    },
    coverage: {
      title: "Tembera Cargo Coverage Across Rwanda",
      description:
        "Tembera Cargo supports goods delivery across Rwanda. Enter precise collection and destination locations to check current shipment options.",
      heading: "Where does Tembera Cargo operate?",
      summary:
        "Tembera Cargo is designed for goods delivery across Rwanda. Coverage for a specific pickup and destination depends on the locations and delivery options available when you request a quote, so enter the exact addresses in the app before planning around a shipment.",
      sections: [
        {
          heading: "Check a specific origin and destination",
          paragraphs: [
            "The shipment form uses locations selected by the sender to request delivery options. A route mentioned in a guide is not a promise that every address or option is available at every moment.",
          ],
        },
        {
          heading: "Select collection and delivery choices",
          paragraphs: [
            "Depending on the quote, the flow may offer home pickup or station drop-off and address delivery or station collection. Confirm the available choices in the app.",
          ],
        },
        {
          heading: "Coverage is not a published timetable",
          paragraphs: [
            "This page does not publish route schedules or guaranteed delivery times. Use the quote and shipment flow for current details about your specific request.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does Tembera Cargo serve all of Rwanda?",
          answer:
            "The service operates across Rwanda, but available choices depend on the exact locations. Enter the pickup and destination details in the app to check your shipment.",
        },
        {
          question: "Are delivery times the same for every district?",
          answer:
            "No universal duration is published here. Review any timing information shown for your shipment in the app before confirming.",
        },
      ],
    },
    "for-small-businesses": {
      title: "Goods Delivery for Small Businesses in Rwanda | Tembera",
      description:
        "Small businesses can request a route-specific cargo quote, choose available handover options and track deliveries with Tembera Cargo.",
      heading: "How can a small business send goods with Tembera Cargo?",
      summary:
        "Tembera Cargo gives a small business a digital flow for arranging goods delivery across Rwanda. Enter the package and recipient details, review the quote and handover options for each shipment, and use its tracking code to follow progress. Check every quote before promising a customer a delivery price or date.",
      sections: [
        {
          heading: "Use the quote for each order",
          paragraphs: [
            "Create a shipment request with its actual origin, destination and package details. The app returns the available option and price for that request; do not reuse an old quote as a guaranteed price for another parcel.",
          ],
        },
        {
          heading: "Choose a handover that fits the order",
          paragraphs: [
            "Select home pickup or station drop-off for the sender and address delivery or station collection for the recipient when those options are available.",
          ],
        },
        {
          heading: "Share shipment updates responsibly",
          paragraphs: [
            "Send the correct tracking code directly to the recipient and keep a separate record of each customer's shipment details.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can a small business use Tembera Cargo for customer orders?",
          answer:
            "A business can request delivery for goods by entering the shipment locations and details in the app and reviewing the available quote.",
        },
        {
          question: "Can I advertise a fixed delivery price to customers?",
          answer:
            "This page does not publish a fixed tariff. Check each shipment quote before stating a delivery price to a customer.",
        },
      ],
    },
    "for-online-sellers": {
      title: "Online Order Delivery in Rwanda | Tembera Cargo",
      description:
        "Arrange online order delivery in Rwanda with Tembera Cargo. Review each shipment quote, compare handover options and share tracking privately.",
      heading: "How to deliver online orders in Rwanda",
      summary:
        "Online sellers can use Tembera Cargo to submit a customer's package for delivery across Rwanda. Enter the parcel route and details, check the available handover options and quote, confirm the shipment, then share its tracking code privately with the buyer.",
      sections: [
        {
          heading: "Prepare complete parcel and recipient details",
          paragraphs: [
            "Confirm the buyer's destination and the package information before requesting a quote. The app uses the entered shipment information to show available options.",
          ],
        },
        {
          heading: "Confirm the quote with the order",
          paragraphs: [
            "Review the quote returned for this parcel. Delivery options and price can depend on the details entered, so avoid promising a fixed fee before checking.",
          ],
        },
        {
          heading: "Give the buyer their tracking code",
          paragraphs: [
            "Share the correct code directly with the intended recipient so they can check the latest available shipment status.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can I send an online order directly to a buyer?",
          answer:
            "Enter the sender, destination and recipient details in the shipment flow, then review the quote and options before confirming.",
        },
        {
          question: "Should I publish my customer's tracking code?",
          answer:
            "No. Tracking codes can reveal shipment information; share the code privately with the intended recipient.",
        },
      ],
    },
    "for-farmers-and-cooperatives": {
      title: "Goods Delivery for Farmers and Cooperatives | Tembera",
      description:
        "Farmers and cooperatives can request a Tembera Cargo quote for goods, check available shipment options and track a delivery.",
      heading: "Plan a goods shipment with Tembera Cargo",
      summary:
        "Farmers and cooperatives can use Tembera Cargo to request delivery of goods between locations in Rwanda. Describe the package accurately, enter the origin and destination, then review the shipment-specific quote and available handover options before confirming.",
      sections: [
        {
          heading: "Describe the goods accurately",
          paragraphs: [
            "Enter the package category and information requested by the form. If a parcel has special handling needs, do not assume those needs can be supported; confirm the available option before dispatch.",
          ],
        },
        {
          heading: "Check the route and quote",
          paragraphs: [
            "Submit exact collection and destination locations to see options for the shipment. The app quote, rather than a general guide, is the current price reference.",
          ],
        },
        {
          heading: "Coordinate recipient handover",
          paragraphs: [
            "Choose the available address-delivery or station-collection option and share the tracking code privately with the recipient.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can a cooperative request delivery for goods?",
          answer:
            "Use the shipment form to enter the route and package details and review the quote and available options for the goods.",
        },
        {
          question: "Can I send goods that need special handling?",
          answer:
            "Check the item category and available options in the shipment flow. Do not assume specialized handling is available unless it is explicitly offered.",
        },
      ],
    },
    "for-students": {
      title: "Send a Package to a Student in Rwanda | Tembera",
      description:
        "Arrange a package delivery for a student with Tembera Cargo: enter the route, review the quote and share tracking privately.",
      heading: "Sending a package to a student?",
      summary:
        "A family member can request delivery to a student using Tembera Cargo by entering the sender, destination and recipient details. Review the available handover options and quote before confirming, then send the tracking code privately so the intended recipient can check the shipment.",
      sections: [
        {
          heading: "Confirm the recipient's details",
          paragraphs: [
            "Check the recipient name and phone and enter the correct destination before creating the shipment.",
          ],
        },
        {
          heading: "Choose a practical handover",
          paragraphs: [
            "Review whether address delivery or station collection is offered for the destination, and make sure the recipient can complete the selected handover.",
          ],
        },
        {
          heading: "Keep the tracking code private",
          paragraphs: [
            "Share the code directly with the student or intended recipient rather than posting it in a group or public listing.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can I send a package to a student in another city?",
          answer:
            "Enter the destination and package details to check the available delivery options for the student's location.",
        },
        {
          question: "What should I share with the student?",
          answer:
            "Share the shipment information needed for handover and the tracking code privately with the intended recipient.",
        },
      ],
    },
    "shipping-fragile-items": {
      title: "Sending Fragile Items with Tembera Cargo",
      description:
        "Review package details and current options before requesting delivery for a fragile item with Tembera Cargo.",
      heading: "What should I know before sending a fragile item?",
      summary:
        "Before requesting delivery for a fragile item, describe the package accurately and check the shipment options shown by Tembera Cargo. Do not assume that special packing, handling, compensation or insurance is included; confirm the applicable terms and available service before handing over the item.",
      sections: [
        {
          heading: "Describe and prepare the item",
          paragraphs: [
            "Enter the package information requested by the app and pack the item appropriately for transport. The app's available categories do not by themselves guarantee specialist handling.",
          ],
        },
        {
          heading: "Check the quote and terms",
          paragraphs: [
            "Review the available option and its quote, then review the applicable terms for restrictions, liability and any special handling before confirming.",
          ],
        },
        {
          heading: "Document and track the shipment",
          paragraphs: [
            "Keep the shipment details and share the tracking code only with the intended recipient.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does Tembera Cargo guarantee that fragile goods will not break?",
          answer:
            "This guide makes no such guarantee. Check the applicable shipment terms and confirm any special handling before sending fragile goods.",
        },
        {
          question: "Is fragile-item insurance included?",
          answer:
            "Do not assume insurance is included. Review the terms and options explicitly shown for your shipment.",
        },
      ],
    },
    "guides/sending-goods-across-rwanda": {
      title: "How to Send Goods Across Rwanda | Tembera Cargo Guide",
      description:
        "A practical guide to arranging a Rwanda goods delivery: enter locations, describe the cargo, compare options and track the shipment.",
      heading: "How do I send goods across Rwanda?",
      summary:
        "To send goods across Rwanda with Tembera Cargo, enter the pickup and delivery locations, provide the requested cargo and recipient details, review the shipment-specific quote and handover options, and confirm the shipment. Use its tracking code to check the latest status and share the code only with the recipient.",
      sections: [
        {
          heading: "Start with exact locations and package details",
          paragraphs: [
            "Choose accurate origins and destinations and describe the parcel as requested. This lets the app check delivery options for the actual shipment.",
          ],
        },
        {
          heading: "Compare what the app offers",
          paragraphs: [
            "Review the available delivery option and price before confirmation. Do not rely on generic online rates or delivery-time estimates for a particular shipment.",
          ],
        },
        {
          heading: "Complete handover and track",
          paragraphs: [
            "Select the sender and recipient handover choices available, confirm the request and keep the shipment tracking code private.",
          ],
        },
      ],
      faqs: [
        {
          question: "What information do I need to send goods?",
          answer:
            "Have the route, package details and recipient information ready to complete the shipment request and review its quote.",
        },
        {
          question: "Can I know the delivery price before the package is collected?",
          answer:
            "The app displays a quote for the shipment before confirmation. Review it before completing the request.",
        },
      ],
    },
    "guides/cargo-vs-courier-vs-bus": {
      title: "Cargo vs Courier vs Bus Parcel Delivery in Rwanda",
      description:
        "Compare delivery choices by handover, route quote and tracking needs. See where Tembera Cargo fits before you send a package.",
      heading: "Cargo vs courier vs bus parcel: what should I compare?",
      summary:
        "When choosing how to send goods in Rwanda, compare who accepts the package, how the recipient receives it, what price is confirmed, and whether you can follow shipment status. Tembera Cargo provides a quote-led shipment flow with available pickup, drop-off, delivery and collection choices and a tracking code.",
      sections: [
        {
          heading: "Compare the handover process",
          paragraphs: [
            "A delivery service should make clear where the sender hands over goods and how the recipient receives them. Tembera Cargo shows home pickup or station drop-off and address delivery or station collection options when available.",
          ],
        },
        {
          heading: "Compare price and availability",
          paragraphs: [
            "Check the actual quote and option for the package and route. Do not assume a bus parcel, independent courier or cargo service has the same coverage, price or responsibilities.",
          ],
        },
        {
          heading: "Compare shipment visibility",
          paragraphs: [
            "Ask whether the sender and recipient can check status and what information a tracking code reveals. Keep any code private.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is Tembera Cargo the same as handing goods to an unknown courier?",
          answer:
            "Tembera Cargo provides an app-based shipment request, handover choices and tracking code. Review the specific service terms and available options for your shipment.",
        },
        {
          question: "Which delivery method is cheapest?",
          answer:
            "There is no universal cheapest method stated here. Compare current prices for the exact route and package before choosing.",
        },
      ],
    },
    "guides/cargo-pricing-rwanda": {
      title: "How Much Does It Cost to Send a Package in Rwanda?",
      description:
        "Package delivery prices depend on the shipment. Learn how to request and review a current Tembera Cargo quote before confirming.",
      heading: "How much does it cost to send a package in Rwanda?",
      summary:
        "There is no single price in this guide that applies to every package and route. Tembera Cargo requests the shipment locations and package information, then shows available options and the quote for that request before you confirm.",
      sections: [
        {
          heading: "Why package quotes can differ",
          paragraphs: [
            "The locations, cargo category, package details and selected fulfillment option form part of the quote request. A price from a different shipment may not apply to yours.",
          ],
        },
        {
          heading: "How to get the current price",
          paragraphs: [
            "Open the shipment flow, enter complete route and package details, and review the resulting price and option before confirming.",
          ],
        },
        {
          heading: "Avoid unsupported price promises",
          paragraphs: [
            "This guide does not publish a tariff, estimated rate or guaranteed fee. Use the current app quote for your shipment.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can I get a price without entering shipment details?",
          answer:
            "The quote is specific to the route and package information, so enter those details in the app to see the current options.",
        },
        {
          question: "Does a route price stay the same for every package?",
          answer:
            "Do not assume that it does. Request a current quote for the actual locations and cargo details.",
        },
      ],
    },
    "how-to-send-a-package": {
      title: "How to Send a Package with Tembera Cargo",
      description:
        "Follow five steps to enter cargo and recipient details, review the quote, confirm delivery and track a Tembera Cargo shipment.",
      heading: "How do I send a package with Tembera Cargo?",
      summary:
        "Use Tembera Cargo to enter the shipment route, describe the package, review the available delivery choices and quote, add the recipient details and confirm. After creating the shipment, keep its tracking code and share it only with the intended recipient.",
      sections: [
        {
          heading: "Check the details before confirmation",
          paragraphs: [
            "Use accurate locations, cargo information and recipient details. Confirm that the displayed price and handover choices match your needs before creating the shipment.",
          ],
        },
      ],
      steps: [
        {
          name: "Enter pickup and destination",
          text: "Choose the origin and destination locations for the package.",
        },
        {
          name: "Describe the cargo",
          text: "Provide the package category and details requested by the shipment form.",
        },
        {
          name: "Review delivery options and quote",
          text: "Compare the available pickup, drop-off, delivery or collection choices and review the shipment-specific price.",
        },
        {
          name: "Add recipient details and confirm",
          text: "Enter the recipient details requested and confirm only after checking the shipment information.",
        },
        {
          name: "Track the shipment",
          text: "Use the shipment tracking code to check its latest available status and share it privately with the intended recipient.",
        },
      ],
      faqs: [
        {
          question: "Can I change shipment details after confirming?",
          answer:
            "This guide does not promise that a confirmed shipment can be edited. Check the app's available shipment actions or contact the service through its official channel.",
        },
        {
          question: "When should I share the tracking code?",
          answer: "Share it privately with the intended recipient after the shipment is created.",
        },
      ],
    },
    "about-nyxarith": {
      title: "About Nyxarith and Tembera Cargo",
      description:
        "Learn about Nyxarith, the Rwanda-based software company behind Tembera Cargo and the Tembera transport services.",
      heading: "Who operates Tembera Cargo?",
      summary:
        "Tembera Cargo is a Tembera service operated by Nyxarith Private Limited Company, registered in Rwanda. Nyxarith builds and operates digital products, and Tembera provides digital tools for transport, passenger travel and goods delivery.",
      sections: [
        {
          heading: "Tembera services",
          paragraphs: [
            "Tembera Intercity helps passengers check available bus trips and book tickets. Tembera Kigali provides Kigali bus tracking, a stop finder and Tap&Go card top-ups. Tembera Cargo arranges goods delivery and shipment tracking across Rwanda.",
          ],
        },
        {
          heading: "Company facts",
          paragraphs: [
            "Company: Nyxarith Private Limited Company. Country of registration: Rwanda. Product: Tembera Cargo, a goods-delivery service. The public company website provides more information about Nyxarith.",
            "The company founding date, registered office address and public support contacts have not been verified for this page and are intentionally not stated. Last updated: 14 October 2026.",
          ],
        },
      ],
      faqs: [
        {
          question: "Who runs Tembera Cargo?",
          answer:
            "Tembera Cargo is operated by Nyxarith Private Limited Company, registered in Rwanda.",
        },
        {
          question: "Are Tembera Cargo and Tembera Kigali the same service?",
          answer:
            "They are separate Tembera services: Cargo arranges goods delivery; Tembera Kigali focuses on city bus tracking, stops and Tap&Go top-ups.",
        },
      ],
    },
    contact: {
      title: "Contact Tembera Cargo",
      description:
        "Find the official Tembera Cargo shipment and tracking pages and the Nyxarith company website.",
      heading: "How can I reach Tembera Cargo?",
      summary:
        "For a shipment, begin with the Tembera Cargo app to create or track a delivery. For company information, visit Nyxarith's official website. A dedicated public support phone number or email has not been verified for this page.",
      sections: [
        {
          heading: "Shipment help",
          paragraphs: [
            "Open the Cargo app to start a shipment or use the tracking form with your shipment code. Do not post tracking codes or personal shipment information publicly.",
          ],
        },
        {
          heading: "Company information",
          paragraphs: [
            "Visit the Nyxarith website for published company information. A public Cargo support contact will be added here when the company supplies and verifies one.",
          ],
        },
      ],
      faqs: [
        {
          question: "Where can I start or track a shipment?",
          answer:
            "Use the official Tembera Cargo app and enter your shipment code on its tracking page.",
        },
        {
          question: "Is there a Cargo support phone or email listed here?",
          answer: "No dedicated public phone number or email has been verified for this page yet.",
        },
      ],
    },
    privacy: {
      title: "Tembera Cargo Privacy Information",
      description:
        "Draft privacy information for Tembera Cargo. The company must verify controller, retention, sharing and contact details before publication.",
      heading: "Tembera Cargo privacy information — review required",
      summary:
        "This draft identifies information that appears in the shipment workflow, including location, package, sender and recipient details, and tracking codes. Nyxarith must review and publish the complete privacy notice, legal basis, retention periods, data-sharing details and contact for data requests before this page can be relied on.",
      sections: [
        {
          heading: "Information present in the shipment flow",
          paragraphs: [
            "The app asks for shipment locations, cargo information and recipient details. Shipment tracking uses a code. This draft does not describe all system logs, retention periods, processors or legal bases.",
          ],
        },
        {
          heading: "Company review needed",
          paragraphs: [
            "Before making this page public or indexable, the company must confirm its data controller details, purposes, lawful bases, retention, recipients and processors, security measures, data-subject rights and contact channel under applicable Rwanda law.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is this the complete Tembera Cargo privacy notice?",
          answer:
            "No. This is a review draft, not the complete privacy notice. Confirm the final policy with Nyxarith before publication.",
        },
        {
          question: "Who should I contact about personal data?",
          answer:
            "A verified data-protection contact has not yet been supplied for this draft page.",
        },
      ],
      noIndex: true,
    },
  },
  rw: {
    cargo: {
      title: "Tembera Cargo | Gutwara Imizigo mu Rwanda",
      description:
        "Menya Tembera Cargo, gutwara ibicuruzwa mu Rwanda, kubona igiciro cy'urugendo no gukurikirana imizigo.",
      heading: "Gutwara imizigo mu Rwanda ukoresheje Tembera Cargo",
      summary:
        "Tembera Cargo ni serivisi ya Nyxarith yo gutwara ibicuruzwa mu Rwanda. Andika aho bifatirwa n'aho bijyanwa, usobanure ibicuruzwa, urebe amahitamo n'igiciro byatanzwe, hanyuma ukoreshe kode yo gukurikirana urebe amakuru aheruka.",
      sections: [
        {
          heading: "Tegura kohereza mbere yo kwemeza",
          paragraphs: [
            "Porogaramu isaba aho imizigo ituruka n'aho ijyanwa n'amakuru yayo mbere yo gutanga igiciro. Reba amahitamo n'igiciro cyatanzwe kuri iyo mizigo; nta giciro kimwe gihoraho ku gihugu cyose.",
          ],
        },
        {
          heading: "Bika kode yo gukurikirana",
          paragraphs: [
            "Nyuma yo kohereza, koresha kode y'imizigo urebe amakuru aheruka. Uhe kode uyakira ugenewe gusa kuko ishobora kwerekana amakuru y'urugendo rw'imizigo.",
          ],
        },
      ],
      faqs: [
        {
          question: "Tembera Cargo igeza ibicuruzwa he?",
          answer:
            "Tembera Cargo itwara ibicuruzwa mu Rwanda. Andika aho imizigo ituruka n'aho ijyanwa muri porogaramu urebe amahitamo ahari.",
        },
        {
          question: "Nshobora kubona igiciro mbere yo kohereza?",
          answer:
            "Yego. Andika inzira n'amakuru y'imizigo, urebe amahitamo n'igiciro mbere yo kwemeza.",
        },
        {
          question: "Nshobora gukurikirana imizigo?",
          answer: "Yego. Koresha kode y'imizigo urebe amakuru aheruka.",
        },
      ],
    },
    "how-it-works": {
      title: "Uko Tembera Cargo Ikora | Gutwara Imizigo",
      description:
        "Menya uko wandika aho imizigo ijyanwa, ureba igiciro, ugahitamo uko itangwa kandi uyikurikirana.",
      heading: "Tembera Cargo ikora ite?",
      summary:
        "Tembera Cargo itegura gutwara ibicuruzwa mu Rwanda binyuze mu ntambwe zoroshye muri porogaramu. Andika aho bifatirwa n'aho bijyanwa, amakuru y'imizigo n'uyakira, urebe igiciro n'uburyo bwo kuyishyikiriza, wemeze kohereza hanyuma ukoreshe kode yayo uyikurikirane.",
      sections: [
        {
          heading: "Andika inzira n'amakuru y'imizigo",
          paragraphs: [
            "Hitamo aho imizigo ituruka n'aho ijyanwa, wandike iby'ingenzi biyiranga. Amakuru yuzuye afasha porogaramu kugaragaza amahitamo ajyanye n'iyo mizigo.",
          ],
        },
        {
          heading: "Hitamo uburyo bwo kuyishyikiriza",
          paragraphs: [
            "Ushobora guhitamo gufatirwa mu rugo cyangwa kuyishyira kuri sitasiyo; uyakira agahitamo kuyigezwaho cyangwa kuyifatira kuri sitasiyo, igihe ibyo byemewe ku mizigo yawe.",
          ],
        },
        {
          heading: "Reba igiciro, wemeze kandi ukurikirane",
          paragraphs: [
            "Reba igiciro mbere yo kwemeza. Kohereza bimaze gukorwa, bika kode yo gukurikirana uyikoreshe urebe amakuru aheruka.",
          ],
        },
      ],
      faqs: [
        {
          question: "Mbona igiciro mbere yo kwemeza?",
          answer: "Yego. Porogaramu yerekana amahitamo n'igiciro mbere yo kwemeza kohereza.",
        },
        {
          question: "Uyakira ashobora gufatira imizigo kuri sitasiyo?",
          answer:
            "Kuyifatira kuri sitasiyo ni bumwe mu buryo bwo kwakira bushobora kugaragara ku mizigo runaka.",
        },
      ],
    },
    pricing: {
      title: "Ibiciro bya Tembera Cargo | Reba Igiciro",
      description:
        "Igiciro cya Tembera Cargo gishingira ku makuru y'imizigo. Reba igiciro cyatanzwe mbere yo kwemeza.",
      heading: "Igiciro cyo gutwara kuri Tembera Cargo kibarwa gite?",
      summary:
        "Tembera Cargo itanga igiciro kijyanye n'amakuru y'imizigo wanditse aho gushyiraho igiciro kimwe ku gihugu cyose. Andika inzira n'ibicuruzwa, urebe uburyo bwo kubitwara n'igiciro, wemeze gusa niba amahitamo yatanzwe akwiriye.",
      sections: [
        {
          heading: "Amakuru akenewe kugira ngo ubone igiciro",
          paragraphs: [
            "Igiciro gishingira ku hantu imizigo ituruka n'aho ijyanwa ndetse n'amakuru yayo. Andika amakuru yuzuye ajyanye n'ibicuruzwa uteganya kohereza.",
          ],
        },
        {
          heading: "Reba uburyo bwo kuyishyikiriza",
          paragraphs: [
            "Gufatira cyangwa gutanga imizigo, kuyigeza cyangwa kuyifatira kuri sitasiyo bishobora kugira amahitamo atandukanye. Igiciro kigaragara mbere yo kwemeza.",
          ],
        },
        {
          heading: "Igiciro cya none kigaragara muri porogaramu",
          paragraphs: [
            "Iyi paji ntitanga urutonde rw'ibiciro bihoraho. Koresha igiciro cya none kigaragara muri Tembera Cargo ku makuru y'imizigo yawe.",
          ],
        },
      ],
      faqs: [
        {
          question: "Tembera Cargo ifite igiciro kimwe ku Rwanda hose?",
          answer:
            "Iyi paji ntivuga ko hari igiciro kimwe. Andika amakuru y'imizigo muri porogaramu urebe igiciro cyatanzwe.",
        },
        {
          question: "Igiciro nkibona ryari?",
          answer: "Igiciro n'amahitamo bigaragara mbere yo kwemeza kohereza.",
        },
      ],
    },
    "safety-and-trust": {
      title: "Umutekano mu Gutanga no Gukurikirana Imizigo | Tembera",
      description:
        "Menya uburyo bwo guteganya uko imizigo itangwa, kuyakira no gukoresha kode yo kuyikurikirana muri Tembera Cargo.",
      heading: "Tembera Cargo ifasha ite gutanga imizigo neza?",
      summary:
        "Tembera Cargo itanga uburyo bwo kwandika imizigo, guhitamo amahitamo yo kuyifata no kuyigeza ahari, no gukurikirana urugendo hakoreshejwe kode. Koresha porogaramu kandi uhe kode uyakira ugenewe gusa; ntukibwire ko ubwishingizi cyangwa igihe ntarengwa byo kuyigeza byemewe niba bitagaragajwe.",
      sections: [
        {
          heading: "Andika amakuru y'imizigo n'uyakira",
          paragraphs: [
            "Porogaramu isaba amakuru y'aho imizigo ijyanwa, ibicuruzwa n'uyakira. Yagenzure mbere yo kwemeza kugira ngo uwatanze n'uwakira bamenyekane neza.",
          ],
        },
        {
          heading: "Hitamo uburyo bwo kuyishyikiriza",
          paragraphs: [
            "Hitamo gufatirwa mu rugo cyangwa kuyishyira kuri sitasiyo, n'uko uyakira ayigezwaho cyangwa ayifatira kuri sitasiyo igihe ayo mahitamo ahari.",
          ],
        },
        {
          heading: "Rinda kode yo gukurikirana",
          paragraphs: [
            "Kode ishobora kugaragaza uko imizigo imeze. Yihe gusa uyakira ugenewe kandi ntuyishyire ahagaragara.",
          ],
        },
      ],
      faqs: [
        {
          question: "Kode yo gukurikirana igaragaza aho imizigo igeze?",
          answer: "Yego. Koresha kode urebe amakuru aheruka; yisangize gusa uyakira ugenewe.",
        },
        {
          question:
            "Tembera Cargo yishingira ko ibicuruzwa bizagera cyangwa ko byose bifite ubwishingizi?",
          answer:
            "Iyi paji ntitanga iryo sezerano. Soma amategeko akurikizwa ku mizigo yawe mbere yo kwemeza.",
        },
      ],
    },
    "track-a-package": {
      title: "Kurikirana Imizigo mu Rwanda | Tembera Cargo",
      description:
        "Andika kode ya Tembera Cargo urebe amakuru aheruka ku mizigo itwarwa mu Rwanda.",
      heading: "Nakurikirana nte imizigo ya Tembera Cargo?",
      summary:
        "Fungura ahakurikiranirwa imizigo muri Tembera Cargo, wandike kode yayo urebe amakuru aheruka. Kode ni amakuru y'ibanga ajyanye n'imizigo: koresha iyo wahawe, kandi uyisangize gusa uyakira ugenewe.",
      sections: [
        {
          heading: "Shaka kode y'imizigo",
          paragraphs: [
            "Koresha kode ijyanye n'iyo mizigo. Niba uri uyakira, saba uwagutumirije kuguha kode nyayo mu buryo bwihariye.",
          ],
        },
        {
          heading: "Reba amakuru aheruka",
          paragraphs: [
            "Fungura porogaramu, wandike kode mu mwanya wabugenewe uyohereze. Porogaramu yerekana amakuru ahari ku mizigo; iyi paji ntigaragaza amakuru y'umuntu ku giti cye.",
          ],
        },
        {
          heading: "Ntushyire kode ahagaragara",
          paragraphs: [
            "Ufite kode ashobora kureba amakuru amwe y'imizigo. Ntuyisangize mu ruhame cyangwa mu matsinda rusange.",
          ],
        },
      ],
      faqs: [
        {
          question: "Nandika he kode yo gukurikirana?",
          answer:
            "Fungura ahakurikiranirwa imizigo muri Tembera Cargo, wandike kode mu mwanya wabugenewe.",
        },
        {
          question: "Nakurikirana imizigo nta kode mfite?",
          answer:
            "Ukeneye kode y'iyo mizigo kugira ngo ukoreshe uburyo bwo kuyikurikirana. Saba uyohereje kuguha kode nyayo.",
        },
      ],
    },
    coverage: {
      title: "Aho Tembera Cargo Ikorera mu Rwanda",
      description:
        "Tembera Cargo itwara ibicuruzwa mu Rwanda. Andika aho bifatirwa n'aho bijyanwa urebe amahitamo ahari.",
      heading: "Tembera Cargo ikorera he?",
      summary:
        "Tembera Cargo itwara ibicuruzwa mu Rwanda. Amahitamo y'aho imizigo ifatirwa n'aho ijyanwa aterwa n'aho wanditse n'iboneka igihe usaba igiciro. Andika aderesi nyazo muri porogaramu mbere yo guteganya kohereza.",
      sections: [
        {
          heading: "Reba aho imizigo ituruka n'aho ijyanwa",
          paragraphs: [
            "Uzuza aho imizigo ifatirwa n'aho ijyanwa kugira ngo porogaramu igaragaze amahitamo ahari. Kuvuga inzira kuri iyi paji si isezerano ko buri aderesi cyangwa buri mahitamo bihora bihari.",
          ],
        },
        {
          heading: "Hitamo uburyo bwo kuyishyikiriza",
          paragraphs: [
            "Bitewe n'igiciro, ushobora kubona gufatirwa mu rugo cyangwa kuyishyira kuri sitasiyo, kuyigeza ku aderesi cyangwa kuyifatira kuri sitasiyo.",
          ],
        },
        {
          heading: "Reba amakuru mashya muri porogaramu",
          paragraphs: [
            "Iyi paji ntitanga gahunda y'ingendo cyangwa igihe gihoraho cyo kugeza imizigo. Koresha amakuru agaragara kuri iyo mizigo muri porogaramu.",
          ],
        },
      ],
      faqs: [
        {
          question: "Tembera Cargo ikorera mu turere twose tw'u Rwanda?",
          answer:
            "Serivisi ikorera mu Rwanda, ariko amahitamo ashingira ku hantu nyaho. Andika aderesi zombi muri porogaramu urebe amahitamo ahari.",
        },
        {
          question: "Imizigo yose imara igihe kimwe igenda?",
          answer:
            "Nta gihe kimwe kivugwa hano. Reba igihe cyagaragajwe ku mizigo yawe muri porogaramu mbere yo kwemeza.",
        },
      ],
    },
    "for-small-businesses": {
      title: "Gutwara Ibicuruzwa by'Ubucuruzi Buto | Tembera",
      description:
        "Abacuruzi bato bashobora kubona igiciro, guhitamo uburyo bwo gutanga ibicuruzwa no gukurikirana imizigo muri Tembera Cargo.",
      heading: "Ubucuruzi buto bwakoresha bute Tembera Cargo?",
      summary:
        "Tembera Cargo ifasha ubucuruzi buto guteganya kugeza ibicuruzwa ku bakiriya mu Rwanda. Andika amakuru y'imizigo n'uyakira, urebe igiciro n'uburyo bwo kuyishyikiriza kuri buri mizigo, hanyuma ukoreshe kode yo gukurikirana. Reba igiciro mbere yo guha umukiriya ikiguzi cyangwa itariki.",
      sections: [
        {
          heading: "Saba igiciro kuri buri mizigo",
          paragraphs: [
            "Andika aho imizigo ituruka n'aho ijyanwa n'amakuru yayo. Igiciro gishingira kuri iyo mizigo; ntukoreshe icyatanzwe mbere nk'igiciro gihoraho cy'indi mizigo.",
          ],
        },
        {
          heading: "Hitamo uburyo bwo kuyishyikiriza",
          paragraphs: [
            "Hitamo gufatira cyangwa gutanga ku sitasiyo n'uko uyakira ayigezwaho cyangwa ayifatira igihe amahitamo ahari.",
          ],
        },
        {
          heading: "Sangiza kode uyakira",
          paragraphs: [
            "Ohereza kode nyayo uyakira mu buryo bwihariye, kandi ubike amakuru ya buri mizigo y'abakiriya bawe.",
          ],
        },
      ],
      faqs: [
        {
          question: "Ubucuruzi buto bushobora kohereza ibicuruzwa ku bakiriya?",
          answer:
            "Yego, andika aho imizigo ituruka n'aho ijyanwa n'amakuru yayo, urebe igiciro n'amahitamo mbere yo kwemeza.",
        },
        {
          question: "Nshobora guha abakiriya igiciro kimwe cyo kubagezaho?",
          answer:
            "Iyi paji ntitanga igiciro gihoraho. Banza urebe igiciro cy'iyo mizigo muri porogaramu.",
        },
      ],
    },
    "for-online-sellers": {
      title: "Gutwara Ibicuruzwa by'Abacuruza Kuri Interineti | Tembera",
      description:
        "Abacuruzi kuri interineti bashobora kohereza ibicuruzwa, kubona igiciro no guha umukiriya kode yo gukurikirana.",
      heading: "Serivisi ifasha abacuruza kuri interineti mu Rwanda",
      summary:
        "Abacuruza kuri interineti bashobora kohereza ibicuruzwa ku bakiriya bakoresheje Tembera Cargo. Andika inzira n'amakuru y'ibicuruzwa, urebe igiciro n'uburyo bwo kubishyikiriza, wemeze kohereza, hanyuma usangize umuguzi kode yo gukurikirana mu buryo bwihariye.",
      sections: [
        {
          heading: "Tegura amakuru y'ibicuruzwa n'uyakira",
          paragraphs: [
            "Emeza aho umuguzi aherereye n'amakuru y'imizigo mbere yo gusaba igiciro. Porogaramu igaragaza amahitamo ishingiye ku makuru watanze.",
          ],
        },
        {
          heading: "Emeza igiciro ku bicuruzwa",
          paragraphs: [
            "Reba igiciro cyatanzwe kuri iyo mizigo. Amahitamo ashobora guterwa n'amakuru wanditse, bityo ntusezeranye igiciro kimwe mbere yo kukireba.",
          ],
        },
        {
          heading: "Ohereza umuguzi kode yo gukurikirana",
          paragraphs: [
            "Sangiza kode nyayo uyakira mu buryo bwihariye kugira ngo arebe amakuru aheruka ku mizigo.",
          ],
        },
      ],
      faqs: [
        {
          question: "Nshobora kohereza ibicuruzwa ku muguzi?",
          answer:
            "Andika amakuru y'aho ibicuruzwa bituruka n'aho bijyanwa, urebe igiciro n'amahitamo mbere yo kwemeza.",
        },
        {
          question: "Nshyire kode y'umukiriya ahagaragara?",
          answer:
            "Oya. Kode ishobora kugaragaza amakuru y'imizigo; yisangize gusa uyakira ugenewe.",
        },
      ],
    },
    "for-farmers-and-cooperatives": {
      title: "Gutwara Ibicuruzwa by'Abahinzi na Koperative | Tembera",
      description:
        "Abahinzi na koperative bashobora gusaba igiciro cyo gutwara ibicuruzwa no gukurikirana imizigo muri Tembera Cargo.",
      heading: "Teganya gutwara ibicuruzwa ukoresheje Tembera Cargo",
      summary:
        "Abahinzi na koperative bashobora gukoresha Tembera Cargo gusaba gutwara ibicuruzwa hagati y'ahantu mu Rwanda. Sobanura neza ibicuruzwa, andika aho bituruka n'aho bijyanwa, urebe igiciro n'uburyo bwo kubishyikiriza mbere yo kwemeza.",
      sections: [
        {
          heading: "Sobanura ibicuruzwa neza",
          paragraphs: [
            "Andika ubwoko n'amakuru asabwa kuri ibyo bicuruzwa. Niba bisaba kwitabwaho mu buryo bwihariye, banza urebe ko iyo serivisi iboneka; ntubyibwire.",
          ],
        },
        {
          heading: "Reba inzira n'igiciro",
          paragraphs: [
            "Andika aderesi z'aho bifatirwa n'aho bijyanwa kugira ngo urebe amahitamo. Igiciro muri porogaramu ni cyo cy'iyo mizigo, si icyo muri rusange.",
          ],
        },
        {
          heading: "Teganya uko uyakira azabishyikirizwa",
          paragraphs: [
            "Hitamo uburyo bwo kugeza cyangwa gufatira bugaragara, usangize kode uyakira mu buryo bwihariye.",
          ],
        },
      ],
      faqs: [
        {
          question: "Koperative yasaba gutwara ibicuruzwa?",
          answer:
            "Yego. Andika inzira n'amakuru y'ibicuruzwa muri porogaramu, urebe igiciro n'amahitamo.",
        },
        {
          question: "Nohereza ibicuruzwa bisaba kwitabwaho mu buryo bwihariye?",
          answer:
            "Reba ubwoko bw'ibicuruzwa n'amahitamo muri porogaramu. Ntukibwire ko serivisi yihariye iboneka keretse igaragajwe.",
        },
      ],
    },
    "for-students": {
      title: "Ohereza Imizigo ku Munyeshuri mu Rwanda | Tembera",
      description:
        "Teganya kohereza imizigo ku munyeshuri ukoresheje Tembera Cargo, urebe igiciro kandi musangize kode mu ibanga.",
      heading: "Ukeneye kohereza imizigo ku munyeshuri?",
      summary:
        "Umuryango ushobora gusaba ko imizigo igezwa ku munyeshuri ukoresheje Tembera Cargo. Andika aho ituruka n'aho ijyanwa n'amakuru y'uyakira, urebe igiciro n'uburyo bwo kuyishyikiriza mbere yo kwemeza, hanyuma usangize kode uyakira mu buryo bwihariye.",
      sections: [
        {
          heading: "Emeza amakuru y'uyakira",
          paragraphs: [
            "Genzura amazina na telefone by'uyakira, wandike aderesi nyayo mbere yo kohereza.",
          ],
        },
        {
          heading: "Hitamo uburyo bworoshye bwo kwakira",
          paragraphs: [
            "Reba niba imizigo igezwa ku aderesi cyangwa uyakira ayifatira kuri sitasiyo, kandi umenye neza ko ashobora kuyakira muri ubwo buryo.",
          ],
        },
        {
          heading: "Rinda kode yo gukurikirana",
          paragraphs: [
            "Sangiza umunyeshuri cyangwa uyakira ugenewe kode mu buryo bwihariye, ntuyishyire mu itsinda cyangwa ahagaragara.",
          ],
        },
      ],
      faqs: [
        {
          question: "Nohereza imizigo ku munyeshuri uri mu wundi mujyi?",
          answer: "Andika aho ijyanwa n'amakuru yayo muri porogaramu urebe amahitamo ahari.",
        },
        {
          question: "Ni ayahe makuru naha umunyeshuri?",
          answer:
            "Mugezeho amakuru akenewe yo kwakira imizigo na kode yo kuyikurikirana mu buryo bwihariye.",
        },
      ],
    },
    "shipping-fragile-items": {
      title: "Kohereza Ibicuruzwa Bimeneka | Tembera Cargo",
      description:
        "Reba amakuru y'ibicuruzwa n'amahitamo mbere yo gusaba gutwara ibimeneka muri Tembera Cargo.",
      heading: "Namenya iki mbere yo kohereza ibicuruzwa bimeneka?",
      summary:
        "Mbere yo kohereza ikintu kimeneka, gisobanure neza kandi urebe amahitamo agaragara muri Tembera Cargo. Ntukibwire ko gupfunyika bidasanzwe, kwitabwaho byihariye, indishyi cyangwa ubwishingizi birimo; banza wemeze amategeko na serivisi biboneka.",
      sections: [
        {
          heading: "Sobanura kandi upfunyike neza",
          paragraphs: [
            "Andika amakuru asabwa kuri ibyo bicuruzwa kandi ubipfunyike uko bikwiye. Ubwoko bw'ibicuruzwa muri porogaramu ntibwemeza ko bizitabwaho mu buryo bwihariye.",
          ],
        },
        {
          heading: "Reba igiciro n'amategeko",
          paragraphs: [
            "Reba amahitamo n'igiciro, hanyuma usome amategeko ajyanye no kwangirika, uburyozwe n'uburyo bwihariye mbere yo kwemeza.",
          ],
        },
        {
          heading: "Bika amakuru kandi ukurikirane",
          paragraphs: [
            "Bika amakuru y'imizigo kandi uhe kode yo kuyikurikirana uyakira ugenewe gusa.",
          ],
        },
      ],
      faqs: [
        {
          question: "Tembera Cargo yemeza ko ibicuruzwa bimeneka bitazangirika?",
          answer:
            "Iyi paji ntitanga iryo sezerano. Banza usome amategeko kandi wemeze uburyo bwo kwitabwaho mbere yo kohereza.",
        },
        {
          question: "Ubwishingizi bw'ibimeneka burimo?",
          answer: "Ntukibwire ko burimo. Reba amategeko n'amahitamo byagaragajwe ku mizigo yawe.",
        },
      ],
    },
    "guides/sending-goods-across-rwanda": {
      title: "Uko Wohereza Ibicuruzwa mu Rwanda | Tembera Cargo",
      description:
        "Uko wakoresha Tembera Cargo kohereza ibicuruzwa: andika ahantu, usobanure imizigo, urebe igiciro uyikurikirane.",
      heading: "Nohereza nte ibicuruzwa mu Rwanda?",
      summary:
        "Kohereza ibicuruzwa ukoresheje Tembera Cargo, andika aho bifatirwa n'aho bijyanwa, amakuru yabyo n'uyakira, urebe igiciro n'amahitamo, hanyuma wemeze kohereza. Koresha kode y'imizigo urebe amakuru aheruka kandi uyisangize uyakira ugenewe gusa.",
      sections: [
        {
          heading: "Tangira ku hantu n'amakuru y'imizigo",
          paragraphs: [
            "Andika neza aho imizigo ituruka n'aho ijyanwa n'ubwoko bwayo. Amakuru nyayo afasha porogaramu kureba amahitamo ajyanye n'iyo mizigo.",
          ],
        },
        {
          heading: "Reba ibyo porogaramu itanga",
          paragraphs: [
            "Reba igiciro n'uburyo bwo kuyishyikiriza mbere yo kwemeza. Ntushingire ku giciro rusange cyangwa igihe kitaremejwe.",
          ],
        },
        {
          heading: "Yishyikirize uyakira kandi uyikurikirane",
          paragraphs: [
            "Hitamo uburyo bwo gufata no kwakira bugaragara, wemeze kohereza, ubike kode y'imizigo kandi uyisangize uyakira gusa.",
          ],
        },
      ],
      faqs: [
        {
          question: "Ni ayahe makuru nkenera kugira ngo ntware ibicuruzwa?",
          answer:
            "Tegura aho bituruka n'aho bijyanwa, amakuru yabyo n'ay'uyakira kugira ngo usabe igiciro.",
        },
        {
          question: "Namenya igiciro mbere y'uko imizigo ifatwa?",
          answer: "Porogaramu yerekana igiciro mbere yo kwemeza kohereza. Banza ukirebe.",
        },
      ],
    },
    "guides/cargo-vs-courier-vs-bus": {
      title: "Cargo, Courier cyangwa Gushyira Imizigo muri Bisi?",
      description:
        "Gerageza uburyo bwo gushyikiriza imizigo, igiciro n'ikurikirana. Menya aho Tembera Cargo ihurira n'ibyo ukeneye.",
      heading: "Nahitamo nte: cargo, courier cyangwa bisi?",
      summary:
        "Mbere yo kohereza ibicuruzwa mu Rwanda, gereranya ubakira imizigo, uko uyakira ayigezwaho, igiciro cyemezwa n'uko ukurikirana urugendo. Tembera Cargo iguha uburyo bwo gusaba gutwara, kubona amahitamo n'igiciro no gukoresha kode y'imizigo.",
      sections: [
        {
          heading: "Gereranya uko imizigo ishyikirizwa",
          paragraphs: [
            "Reba neza aho utanga imizigo n'uko uyakira azayibona. Tembera Cargo yerekana gufatira cyangwa gutanga kuri sitasiyo no kugeza cyangwa gufatira igihe ibyo biboneka.",
          ],
        },
        {
          heading: "Gereranya igiciro n'aho serivisi igeza",
          paragraphs: [
            "Reba igiciro cy'iyo mizigo n'iyo nzira. Ntukibwire ko bisi, courier wigenga na serivisi ya cargo bifite aho bigera, ibiciro cyangwa inshingano bimwe.",
          ],
        },
        {
          heading: "Gereranya uburyo bwo kubona amakuru",
          paragraphs: [
            "Baza niba uwatanze n'uwakira bashobora kureba aho imizigo igeze n'amakuru kode igaragaza. Bika kode mu ibanga.",
          ],
        },
      ],
      faqs: [
        {
          question: "Tembera Cargo ni kimwe no guha imizigo courier utazi?",
          answer:
            "Tembera Cargo itanga uburyo bwo gusaba gutwara, guhitamo uburyo bwo kuyishyikiriza no gukurikirana. Soma amategeko n'amahitamo y'iyo mizigo.",
        },
        {
          question: "Ni ubuhe buryo buhendutse kurusha ubundi?",
          answer:
            "Nta buryo buhendutse buhoraho buvugwa hano. Gereranya ibiciro by'ubu by'iyo nzira n'iyo mizigo.",
        },
      ],
    },
    "guides/cargo-pricing-rwanda": {
      title: "Gutwara Imizigo mu Rwanda Bitwara Angahe?",
      description:
        "Igiciro giterwa n'imizigo. Menya uko wasaba igiciro cya none muri Tembera Cargo mbere yo kwemeza.",
      heading: "Kohereza imizigo mu Rwanda bitwara angahe?",
      summary:
        "Nta giciro kimwe muri iyi nyandiko kigenewe imizigo n'inzira zose. Tembera Cargo isaba aho imizigo ijyanwa n'amakuru yayo, hanyuma ikerekana amahitamo n'igiciro cyatanzwe mbere yo kwemeza.",
      sections: [
        {
          heading: "Impamvu ibiciro bishobora gutandukana",
          paragraphs: [
            "Aho imizigo ituruka n'aho ijyanwa, ubwoko bwayo, amakuru yayo n'uburyo bwo kuyigeza biri mu makuru akoreshwa mu gusaba igiciro. Igiciro cy'indi mizigo gishobora kudakurikizwa ku yawe.",
          ],
        },
        {
          heading: "Uko wabona igiciro cya none",
          paragraphs: [
            "Fungura kohereza imizigo, wandike amakuru yuzuye y'inzira n'ibicuruzwa, urebe igiciro n'amahitamo mbere yo kwemeza.",
          ],
        },
        {
          heading: "Irinde gutanga igiciro kitaremejwe",
          paragraphs: [
            "Iyi paji ntitanga ibiciro bihoraho cyangwa igiciro cyemewe. Koresha igiciro cy'ubu kigaragara muri porogaramu.",
          ],
        },
      ],
      faqs: [
        {
          question: "Nabona igiciro ntarandika amakuru y'imizigo?",
          answer:
            "Igiciro gishingira ku nzira n'amakuru y'ibicuruzwa, bityo andika ibyo muri porogaramu urebe igiciro.",
        },
        {
          question: "Ibicuruzwa byose ku nzira imwe bigira igiciro kimwe?",
          answer:
            "Ntukibwire ko ari kimwe. Saba igiciro gishingiye ku hantu n'ubwoko bw'imizigo yawe.",
        },
      ],
    },
    "how-to-send-a-package": {
      title: "Uko Wohereza Imizigo ukoresheje Tembera Cargo",
      description:
        "Intambwe eshanu zo kwandika amakuru, kureba igiciro, kwemeza kohereza no gukurikirana imizigo.",
      heading: "Nohereza nte imizigo muri Tembera Cargo?",
      summary:
        "Koresha Tembera Cargo wandike inzira n'amakuru y'imizigo, urebe amahitamo n'igiciro, wongere amakuru y'uyakira hanyuma wemeze kohereza. Iyo imizigo imaze koherezwa, bika kode yayo uyisangize uyakira ugenewe gusa.",
      sections: [
        {
          heading: "Genzura amakuru mbere yo kwemeza",
          paragraphs: [
            "Andika neza aho imizigo ituruka n'aho ijyanwa, ubwoko bwayo n'amakuru y'uyakira. Emeza ko igiciro n'uburyo bwo kuyishyikiriza bihuye n'ibyo ukeneye.",
          ],
        },
      ],
      steps: [
        {
          name: "Andika aho ifatirwa n'aho ijyanwa",
          text: "Hitamo aho imizigo ituruka n'aho ijyanwa.",
        },
        { name: "Sobanura ibicuruzwa", text: "Andika ubwoko n'amakuru asabwa kuri iyo mizigo." },
        {
          name: "Reba amahitamo n'igiciro",
          text: "Gereranya uburyo bwo gufata, gutanga, kugeza cyangwa kwakira, urebe igiciro cy'iyo mizigo.",
        },
        {
          name: "Andika amakuru y'uyakira wemeze",
          text: "Andika amakuru y'uyakira asabwa kandi wemeze nyuma yo kugenzura amakuru y'imizigo.",
        },
        {
          name: "Kurikirana imizigo",
          text: "Koresha kode y'imizigo urebe amakuru aheruka kandi uyisangize uyakira mu buryo bwihariye.",
        },
      ],
      faqs: [
        {
          question: "Nshobora guhindura amakuru y'imizigo maze kuyemeza?",
          answer:
            "Iyi nyandiko ntisezeranya ko byemewe. Reba amahitamo agaragara muri porogaramu cyangwa ukoreshe inzira yemewe yo kuvugana na serivisi.",
        },
        {
          question: "Kode yo gukurikirana nyisangiza ryari?",
          answer: "Nyuma yo gukora imizigo, yisangize uyakira mu buryo bwihariye.",
        },
      ],
    },
    "about-nyxarith": {
      title: "Ibyerekeye Nyxarith na Tembera Cargo",
      description:
        "Menya Nyxarith, ikigo gikora Tembera Cargo n'izindi serivisi za Tembera mu Rwanda.",
      heading: "Ni ikihe kigo gikora Tembera Cargo?",
      summary:
        "Tembera Cargo ni serivisi ya Tembera ikorwa na Nyxarith Private Limited Company, ikigo cyanditswe mu Rwanda. Nyxarith ikora porogaramu n'ibindi bikoresho by'ikoranabuhanga, naho Tembera igatanga serivisi z'ubwikorezi, ingendo z'abagenzi no gutwara ibicuruzwa.",
      sections: [
        {
          heading: "Serivisi za Tembera",
          paragraphs: [
            "Tembera Intercity ifasha kureba ingendo za bisi zigaragara no kugura amatike. Tembera Kigali itanga gukurikirana bisi zo mu mujyi, gushakisha aho zihagarara no kongera amafaranga kuri Tap&Go. Tembera Cargo iteganya gutwara ibicuruzwa no kubikurikirana mu Rwanda.",
          ],
        },
        {
          heading: "Amakuru y'ikigo",
          paragraphs: [
            "Ikigo: Nyxarith Private Limited Company. Igihugu cy'iyandikwa: u Rwanda. Igicuruzwa: Tembera Cargo, serivisi yo gutwara ibicuruzwa. Sura urubuga rwa Nyxarith kugira ngo umenye ibindi.",
            "Itariki ikigo cyatangiriyeho, aderesi y'ibiro n'amakuru yo kugihamagara ntibiragenzurwa kuri uru rupapuro, bityo ntibivugwa. Iheruka kuvugururwa: 14 Ukwakira 2026.",
          ],
        },
      ],
      faqs: [
        {
          question: "Ni nde ukora Tembera Cargo?",
          answer:
            "Tembera Cargo ikorwa na Nyxarith Private Limited Company, ikigo cyanditswe mu Rwanda.",
        },
        {
          question: "Tembera Cargo na Tembera Kigali ni serivisi imwe?",
          answer:
            "Ni serivisi zitandukanye za Tembera: Cargo itwara ibicuruzwa; Tembera Kigali ifasha gukurikirana bisi, gushaka aho zihagarara no kongera amafaranga kuri Tap&Go.",
        },
      ],
    },
    contact: {
      title: "Vugana na Tembera Cargo",
      description:
        "Fungura porogaramu ya Tembera Cargo cyangwa urubuga rwa Nyxarith ku makuru y'ikigo.",
      heading: "Nakora iki kugira ngo mbone Tembera Cargo?",
      summary:
        "Ku bijyanye n'imizigo, fungura porogaramu ya Tembera Cargo kugira ngo wohereze cyangwa ukurikirane. Ku makuru y'ikigo, sura urubuga rwa Nyxarith. Telefoni cyangwa imeyili byihariye byo gufasha abakiriya ntibiragenzurwa ngo bishyirwe kuri iyi paji.",
      sections: [
        {
          heading: "Ubufasha ku mizigo",
          paragraphs: [
            "Fungura porogaramu ya Cargo kugira ngo wohereze cyangwa ukoreshe kode ukurikirane imizigo. Ntushyire kode cyangwa amakuru bwite y'imizigo ahagaragara.",
          ],
        },
        {
          heading: "Amakuru y'ikigo",
          paragraphs: [
            "Sura urubuga rwa Nyxarith ku makuru y'ikigo yatangajwe. Amakuru yihariye yo gufasha abakiriya azongerwaho amaze gutangwa no kugenzurwa n'ikigo.",
          ],
        },
      ],
      faqs: [
        {
          question: "Nohereza cyangwa nkurikirana imizigo he?",
          answer: "Koresha porogaramu ya Tembera Cargo; ku makuru y'urugendo, andika kode yawe.",
        },
        {
          question: "Hari telefone cyangwa imeyili ya Cargo yanditse hano?",
          answer:
            "Oya. Nta telefone cyangwa imeyili yihariye y'abakiriya iragenzurwa ngo ishyirwe kuri iyi paji.",
        },
      ],
    },
    privacy: {
      title: "Amakuru y'Ibanga ya Tembera Cargo",
      description:
        "Inyandiko y'amakuru y'ibanga ya Tembera Cargo. Ikigo kigomba kugenzura amakuru yo kubika no gusangiza mbere yo kuyitangaza.",
      heading: "Amakuru y'ibanga ya Tembera Cargo — agomba kugenzurwa",
      summary:
        "Iyi nyandiko igaragaza amakuru agaragara mu kohereza imizigo, harimo aho ijyanwa, amakuru y'ibicuruzwa, uwabitanga n'uyakira na kode yo gukurikirana. Nyxarith igomba kwemeza inyandiko yuzuye, impamvu zo gukoresha amakuru, igihe abikwa, abo asangizwa n'aho basabira amakuru mbere yo kuyitangaza.",
      sections: [
        {
          heading: "Amakuru agaragara mu kohereza imizigo",
          paragraphs: [
            "Porogaramu isaba ahantu imizigo ijyanwa, amakuru y'ibicuruzwa n'uyakira. Kode ikoreshwa mu gukurikirana. Iyi nyandiko ntisobanura amakuru yose abikwa, igihe amara cyangwa abandi bayabona.",
          ],
        },
        {
          heading: "Ikigo kigomba kubanza kugenzura",
          paragraphs: [
            "Mbere yo gutangaza iyi paji, ikigo kigomba kwemeza uwashinzwe amakuru, impamvu n'amategeko yo kuyakoresha, igihe abikwa, abayakira, umutekano, uburenganzira bw'abaturage n'aho basaba amakuru hakurikijwe amategeko y'u Rwanda.",
          ],
        },
      ],
      faqs: [
        {
          question: "Iyi ni inyandiko yuzuye y'amakuru y'ibanga?",
          answer: "Oya. Ni umushinga ugomba kugenzurwa; si inyandiko yuzuye y'amakuru y'ibanga.",
        },
        {
          question: "Nabaza nde ibyerekeye amakuru yanjye bwite?",
          answer: "Nta muntu ushinzwe kurinda amakuru bwite uratangazwa kuri uyu mushinga.",
        },
      ],
      noIndex: true,
    },
  },
};

export const cargoSeoPages: LocalizedCargoPage[] = [];

for (const locale of ["en", "rw"] as const) {
  for (const [slug, content] of Object.entries(corePages[locale])) {
    const existing = cargoSeoPages.find((page) => page.slug === slug);
    if (existing) existing[locale] = content;
    else {
      const english = corePages.en[slug];
      const kinyarwanda = corePages.rw[slug];
      if (!english || !kinyarwanda) throw new Error(`Missing localized Cargo page: ${slug}`);
      cargoSeoPages.push({ slug, en: english, rw: kinyarwanda });
    }
  }
}

cargoSeoPages.push({
  slug: "help",
  en: cargoHelpPage.en,
  rw: cargoHelpPage.rw,
});

for (const [cityA, cityB] of cityPairs) {
  const directions = [
    [cityA, cityB],
    [cityB, cityA],
  ] as const;
  for (const [from, to] of directions) {
    const slug = `cargo/${from.toLowerCase()}-to-${to.toLowerCase()}`;
    const en = routePage(
      "en",
      from[0]!.toUpperCase() + from.slice(1),
      to[0]!.toUpperCase() + to.slice(1),
    );
    const rw = routePage(
      "rw",
      from[0]!.toUpperCase() + from.slice(1),
      to[0]!.toUpperCase() + to.slice(1),
    );
    cargoSeoPages.push({ slug, en, rw });
  }
}

export function getCargoSeoPage(
  locale: CargoLocale,
  slug: string,
): CargoSeoPageContent | undefined {
  return cargoSeoPages.find((page) => page.slug === slug)?.[locale];
}

export function cargoSeoPageHead(locale: CargoLocale, slug: string, page: CargoSeoPageContent) {
  const canonical = absoluteSiteUrl(`/${locale}/${slug}`);
  const localeBase = absoluteSiteUrl(`/${locale}`);
  const faq = page.faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  }));
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": "https://nyxarith.com/#organization",
      name: "Nyxarith Private Limited Company",
      url: "https://nyxarith.com/",
      areaServed: { "@type": "Country", name: "Rwanda" },
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteSiteUrl("/")}#website`,
      name: "Tembera Cargo",
      url: absoluteSiteUrl("/"),
      description: page.description,
      publisher: { "@id": "https://nyxarith.com/#organization" },
      inLanguage: locale === "en" ? "en-RW" : "rw-RW",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absoluteSiteUrl("/track")}?code={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${absoluteSiteUrl(`/${locale}`)}#application`,
      name: "Tembera Cargo",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      image: absoluteSiteUrl("/tembera-logo.jpg"),
      url: localeBase,
      inLanguage: locale === "en" ? "en-RW" : "rw-RW",
      publisher: { "@id": "https://nyxarith.com/#organization" },
    },
    {
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: "Tembera Cargo",
      serviceType: "Cargo and parcel delivery",
      description: page.summary,
      areaServed: { "@type": "Country", name: "Rwanda" },
      provider: { "@id": "https://nyxarith.com/#organization" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: locale === "en" ? "Shipment fulfillment options" : "Uburyo bwo gutanga imizigo",
        itemListElement: [
          { "@type": "Offer", name: locale === "en" ? "Home pickup" : "Gufatira mu rugo" },
          {
            "@type": "Offer",
            name: locale === "en" ? "Station drop-off" : "Gushyira kuri sitasiyo",
          },
          { "@type": "Offer", name: locale === "en" ? "Address delivery" : "Kugeza ku aderesi" },
          {
            "@type": "Offer",
            name: locale === "en" ? "Station collection" : "Gufatira kuri sitasiyo",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      inLanguage: locale === "en" ? "en-RW" : "rw-RW",
      mainEntity: faq,
    },
  ];

  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: locale === "en" ? "Home" : "Ahabanza",
      item: localeBase,
    },
  ];
  if (slug !== "cargo") {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 2,
      name: "Tembera Cargo",
      item: absoluteSiteUrl(`/${locale}/cargo`),
    });
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: page.heading,
      item: canonical,
    });
  }
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: breadcrumbs,
  });

  if (page.steps) {
    graph.push({
      "@type": "HowTo",
      "@id": `${canonical}#howto`,
      name: page.heading,
      description: page.summary,
      inLanguage: locale === "en" ? "en-RW" : "rw-RW",
      step: page.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  const languageLinks = [
    { rel: "alternate", href: absoluteSiteUrl(`/en/${slug}`), hrefLang: "en" },
    { rel: "alternate", href: absoluteSiteUrl(`/rw/${slug}`), hrefLang: "rw" },
    { rel: "alternate", href: absoluteSiteUrl(`/en/${slug}`), hrefLang: "x-default" },
  ];

  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      {
        name: "robots",
        content: page.noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
      },
      { property: "og:site_name", content: "Tembera Cargo" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: locale === "en" ? "en_RW" : "rw_RW" },
      { property: "og:image", content: absoluteSiteUrl("/og-image.jpg") },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: absoluteSiteUrl("/og-image.jpg") },
    ],
    links: [{ rel: "canonical", href: canonical }, ...languageLinks],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      },
    ],
  };
}

export function cargoSeoSitemapEntries(
  lastmod: string,
): Array<{ url: string; lastmod: string; slug: string }> {
  return cargoSeoPages
    .filter((page) => !page.en.noIndex && !page.rw.noIndex)
    .flatMap((page) =>
      (["en", "rw"] as const).map((locale) => ({
        url: absoluteSiteUrl(`/${locale}/${page.slug}`),
        lastmod,
        slug: page.slug,
      })),
    );
}
