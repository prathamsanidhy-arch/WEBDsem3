async function main() {
    await createInflate();

    await readFile();

    await updateFile();
}
main();