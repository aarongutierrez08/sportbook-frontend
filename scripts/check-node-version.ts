import fs from "fs";
import path from "path";

function readNvmrc(): string | null {
    const nvmrcPath = path.resolve(process.cwd(), ".nvmrc");
    if (!fs.existsSync(nvmrcPath)) return null;
    return fs.readFileSync(nvmrcPath, "utf8").trim();
}

function getNodeVersion(): string {
    return process.versions.node;
}

const required = readNvmrc();
const current = getNodeVersion();

if (required && !current.startsWith(required)) {
    console.error(
        `Versión de Node incorrecta. Requerida: ${required}, actual: ${current}\n` +
        `Solución: ejecutar "nvm use" o "nvm install ${required}"`
    );
    process.exit(1);
} else {
    console.log(`Versión de Node correcta (${current})`);
}
