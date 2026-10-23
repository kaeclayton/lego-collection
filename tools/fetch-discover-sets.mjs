import { readFile, writeFile } from 'node:fs/promises';

const API_KEY = process.env.REBRICKABLE_API_KEY;
const POOL_SIZE = 50;

if (!API_KEY) {
    console.error('REBRICKABLE_API_KEY is not set.');
    process.exit(1);
}

const collection = JSON.parse(await readFile('data/my-collection.json', 'utf8'));
const owned = new Set(collection.map(set => set.set_num));

const response = await fetch('https://rebrickable.com/api/v3/lego/sets/?min_parts=1000&ordering=-year&page_size=200',
    { headers: { Authorization: `key ${API_KEY}` } }
);

if (!response.ok) {
    console.error(`Rebrickable returned ${response.status}`);
    process.exit(1);
}

const data = await response.json();

const pool = data.results
    .filter(set => set.set_img_url && !owned.has(set.set_num))
    .slice(0, POOL_SIZE)
    .map(set => ({
        set_num: set.set_num,
        name: set.name,
        year: set.year,
        num_parts: set.num_parts,
        set_img: set.set_img_url,
        url: set.set_url
    }));

await writeFile('data/discover-sets.json', JSON.stringify(pool, null, 2) + '\n');
console.log(`Saved ${pool.length} sets.`);
