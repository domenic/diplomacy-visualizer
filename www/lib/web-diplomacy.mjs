export default async function () {
  const rawData = await fetchRawData();
  return translateBoardStatus(rawData);
}

function fetchRawData() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // TODO figure out game ID => URL mapping.
    script.src = "https://webdiplomacy.net/cache/games/2786/278626/6-json.map";

    script.onerror = () => reject(new Error("Could not load the board from webdiplomacy.net"));
    script.onload = () => {
      window.$H = () => {};
      window.loadBoardTurnData();
      resolve(window.TerrStatus);

      // Cleanup for good measure.
      // We can't delete loadBoardTurnData because function declarations are non-configurable.
      delete window.TerrStatus;
      delete window.Units;
      delete window.$H;
    };

    document.head.append(script);
  });
}

// From https://github.com/kestasjk/webDiplomacy/blob/5df717f1f7e166a5f417a58c37484d20a5cbe5cc/variants/Classic/variant.php#L34
const countryFromIds = [
  null,
  "England",
  "France",
  "Italy",
  "Germany",
  "Austria",
  "Turkey",
  "Russia"
];

// From https://github.com/kestasjk/webDiplomacy/blob/5df717f1f7e166a5f417a58c37484d20a5cbe5cc/variants/Classic/install.php#L31-L111
const regionFromIds = [
  null,
  "Clyde",
  "Edinburgh",
  "Liverpool",
  "Yorkshire",
  "Wales",
  "London",
  "Portugal",
  "Spain",
  "North Africa",
  "Tunis",
  "Naples",
  "Rome",
  "Tuscany",
  "Piedmont",
  "Venice",
  "Apulia",
  "Greece",
  "Albania",
  "Serbia",
  "Bulgaria",
  "Rumania",
  "Constantinople",
  "Smyrna",
  "Ankara",
  "Armenia",
  "Syria",
  "Sevastopol",
  "Ukraine",
  "Warsaw",
  "Livonia",
  "Moscow",
  "St. Petersburg",
  "Finland",
  "Sweden",
  "Norway",
  "Denmark",
  "Kiel",
  "Berlin",
  "Prussia",
  "Silesia",
  "Munich",
  "Ruhr",
  "Holland",
  "Belgium",
  "Picardy",
  "Brest",
  "Paris",
  "Burgundy",
  "Marseilles",
  "Gascony",
  "Barents Sea",
  "Norwegian Sea",
  "North Sea",
  "Skagerrack",
  "Heligoland Bight",
  "Baltic Sea",
  "Gulf of Bothnia",
  "North Atlantic Ocean",
  "Irish Sea",
  "English Channel",
  "Mid-Atlantic Ocean",
  "Western Mediterranean",
  "Gulf of Lyons",
  "Tyrrhenian Sea",
  "Ionian Sea",
  "Adriatic Sea",
  "Aegean Sea",
  "Eastern Mediterranean",
  "Black Sea",
  "Tyrolia",
  "Bohemia",
  "Vienna",
  "Trieste",
  "Budapest",
  "Galicia",
  "Spain", // north coast
  "Spain", // south coast
  "St. Petersburg", // north coast
  "St. Petersburg", // south coast
  "Bulgaria", // north coast
  "Bulgaria" // south coast
];

function translateBoardStatus(rawData) {
  const result = {};
  for (const entry of rawData) {
    result[regionFromIds[entry.id]] = {
      currentOwner: countryFromIds[entry.ownerCountryID],
      occupied: Boolean(entry.unitID)
    };
  }
  return result;
}
