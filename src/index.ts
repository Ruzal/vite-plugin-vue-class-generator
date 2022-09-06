import { Plugin } from "vite";

export default function ClassGenerator(): Plugin {

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  const generatedClasses: Record<string, string> = {};

  function generateClass(key: string): string {
    if (generatedClasses[key]) {
      return generatedClasses[key];
    }

    let result = "";
    for ( let i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * (i == 0 ? (charactersLength - 10) : charactersLength)));
    }

    generatedClasses[key] = result;

    return result;
  }

  return {
    name: "vue-class-generator",
    // enforce: "pre",
    transform: (code, id?, options?) => {
      if (code.search(/GC\.[^"]+/) != -1) {

        let transformed = code.replace(/GC\.[^"\s]+/g, (value) => {

          let scopeId = "";
          let start = value.indexOf("[");
          if (start > -1) {
            scopeId = value.slice(start);
            value = value.split(scopeId).join("");
          }

          return generateClass(value) + scopeId;
        });

        return {
          code: transformed,
          map: ""
        }
      }
    },
  }
}