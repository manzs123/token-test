import StyleDictionary from "style-dictionary";
import { registerTransforms } from "@tokens-studio/sd-transforms";
import { promises } from "node:fs";

registerTransforms(StyleDictionary);

console.log(StyleDictionary);

async function run() {
  const $themes = JSON.parse(
    await promises.readFile("themes/$themes.json", "utf-8")
  );
  const configs = $themes.map((theme) => ({
    source: Object.entries(theme.selectedTokenSets)
      .filter(([, val]) => val === "source")
      .map(([tokenset]) => {
        console.log(tokenset);
        return `themes/${tokenset}.json`;
      }),
    platforms: {
      js: {
        transformGroup: "tokens-studio",
        files: [
          {
            destination: `build/js/variables_${theme.name.toLowerCase()}.js`,
            format: "javascript/es6",
          },
        ],
      },
    },
  }));

  configs.forEach(async (cfg) => {
    const sd = new StyleDictionary(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}

run();