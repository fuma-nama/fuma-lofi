const { parseFile } = require("music-metadata");
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const publicDir = await fs.readdir("./public");

  const items = [];

  const tasks = publicDir
    .filter((item) => item.endsWith(".mp3"))
    .map(async (item) => {
      const metadata = await parseFile(path.resolve("public", item));

      const base = {
        name: metadata.common.title,
        author: metadata.common.artist,
        url: `/${item}`,
      };

      if (metadata.common.picture) {
        const { format, data } = metadata.common.picture[0];
        const ext = format.split("/")[1];
        const name = `${item}-info.${ext}`;

        await fs.writeFile(path.resolve("public", name), data);
        base.picture = `/${name}`;
      }

      items.push(base);
    });

  await Promise.all(tasks);
  await fs.writeFile("./music/data.json", JSON.stringify(items));
}

void main();
