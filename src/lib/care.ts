import type { Product } from "./data";

export interface CareInfo {
  material: string;
  wash: string;
  bleach: string;
  dry: string;
  iron: string;
  note?: string;
}

/**
 * Returns care instructions for a product based on its type.
 * Order matters — check specific pieces (leather, knitwear, denim)
 * before generic clothing keywords.
 */
export function getCareInfo(product: Product): CareInfo {
  const name = product.name.toLowerCase();

  // Leather / faux-leather jacket
  if (name.includes("xhaket") && (name.includes("lëkur") || name.includes("lekur"))) {
    return {
      material: "Lëkurë e cilësisë së lartë",
      wash: "Pastrojeni vetëm me leckë të lagësht — mos e lani në ujë",
      bleach: "Mos përdorni zbardhues",
      dry: "Lëreni të thahet natyrshëm, larg nxehtësisë direkte",
      iron: "Mos hekurosni — avulli dëmton lëkurën",
      note: "Përdorni produkte të specializuara për lëkurë një herë në disa muaj",
    };
  }

  // Knitwear / sweater
  if (name.includes("trikotazh") || name.includes("pulover")) {
    return {
      material: "Fibra të buta të thurura",
      wash: "Lani me dorë në ujë të ftohtë ose në program delikat",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni të shtrirë në vend të sheshtë, jo të varur",
      iron: "Hekurosni në temperaturë të ulët",
      note: "Shmangni tharësen — thurja mund të humbasë formën",
    };
  }

  // Denim (jeans, denim jacket)
  if (name.includes("xhinse") || (name.includes("xhup") && name.includes("xhin"))) {
    return {
      material: "Xhinse (denim)",
      wash: "Lani në 30°C, nga ana e kundërt për të ruajtur ngjyrën",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni në ajër — shmangni tharësen që tkurret",
      iron: "Hekurosni me avull në temperaturë mesatare",
      note: "Larja e rrallë zgjat jetën e xhinseve",
    };
  }

  // T-shirt
  if (name.includes("tshirt") || name.includes("t-shirt")) {
    return {
      material: "Pambuk organik",
      wash: "Lani në makinë në 30-40°C",
      bleach: "Mund të përdorni zbardhues të butë për të bardhat",
      dry: "Thajeni në ajër ose në tharëse në temperaturë të ulët",
      iron: "Hekurosni në temperaturë mesatare",
    };
  }

  // Evening dress
  if (name.includes("fustan nate") || name.includes("nate")) {
    return {
      material: "Pëlhurë e hollë elegante",
      wash: "Rekomandohet pastrim kimik (dry clean)",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni të shtrirë në hije",
      iron: "Hekurosni në temperaturë të ulët ose me avull",
      note: "Ky produkt është delikat — trajtojeni me kujdes",
    };
  }

  // Dress
  if (name.includes("fustan")) {
    return {
      material: "Pëlhurë premium",
      wash: "Lani në 30°C në program delikat ose me dorë",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni në ajër, larg diellit direkt",
      iron: "Hekurosni në temperaturë të ulët",
    };
  }

  // Blouse / shirt
  if (name.includes("bluz") || name.includes("këmish")) {
    return {
      material: "Pambuk i pastër",
      wash: "Lani në makinë në 30-40°C",
      bleach: "Mund të përdorni zbardhues të butë",
      dry: "Thajeni në ajër — tharësja e thërrmon",
      iron: "Hekurosni në temperaturë mesatare për vija të pastra",
    };
  }

  // Jacket / sport jacket / hoodie
  if (name.includes("xhaket") || name.includes("xhup")) {
    return {
      material: "Material teknik i qëndrueshëm",
      wash: "Lani në 30°C me program të butë",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni në ajër",
      iron: "Hekurosni në temperaturë të ulët",
    };
  }

  // Trousers
  if (name.includes("pantallona")) {
    return {
      material: "Pëlhurë elegante",
      wash: "Lani në 30°C në program delikat",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni në ajër",
      iron: "Hekurosni në temperaturë mesatare për vija të pastra",
    };
  }

  // Skirt
  if (name.includes("fund")) {
    return {
      material: "Pëlhurë premium",
      wash: "Lani në 30°C në program delikat",
      bleach: "Mos përdorni zbardhues",
      dry: "Thajeni në ajër",
      iron: "Hekurosni në temperaturë të ulët",
    };
  }

  // Shoes
  if (name.includes("këpuc")) {
    return {
      material: "Material i qëndrueshëm",
      wash: "Pastrojini me leckë të lagësht — mos i lani në makinë",
      bleach: "Mos përdorni zbardhues",
      dry: "Lërini të thahen natyrshëm pas përdorimit",
      iron: "Nuk kërkohet hekurosje",
      note: "Përdorni spërkatës mbrojtës për të zgjatur jetën e tyre",
    };
  }

  // Handbag
  if (name.includes("çant")) {
    return {
      material: "Material premium",
      wash: "Pastrojeni me leckë të butë të lagësht",
      bleach: "Mos përdorni zbardhues",
      dry: "Mbajeni larg lagështisë dhe diellit direkt",
      iron: "Nuk kërkohet hekurosje",
      note: "Ruajeni në çantë mbrojtëse kur nuk përdoret",
    };
  }

  // Default
  return {
    material: "Material cilësor",
    wash: "Lani në 30°C në program të butë",
    bleach: "Mos përdorni zbardhues",
    dry: "Thajeni në ajër",
    iron: "Hekurosni në temperaturë të ulët",
  };
}
