export async function getMyCollection() {
    try {
        const response = await fetch('data/my-collection.json');

        if (!response.ok) {
            throw new Error(`Failed to load collection: ${response.status}`);
        }

        const collectionData = await response.json();
        return collectionData;

    } catch (error) {
        return [];
    }
}