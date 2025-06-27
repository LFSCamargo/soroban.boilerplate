export function getRootDirectory(): string {
  return `${process.cwd()}`
    .split("/")
    .filter((part) => part !== "cli")
    .join("/");
}
