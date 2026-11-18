// Tema claro/escuro. Fica fora do ThemeToggle porque o layout (Server Component) precisa do script,
// e um ficheiro "use client" só pode exportar componentes para o servidor.

export const THEME_STORAGE_KEY = "theme";

// Corre no <head> antes de a página aparecer: aplica a escolha guardada ou, se não houver, a do sistema.
// Sem isto, quem escolheu "claro" veria um flash do tema escuro em cada página.
export const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
    var system = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.dataset.theme = saved === "light" || saved === "dark" ? saved : system;
  } catch (e) {}
})();
`;
