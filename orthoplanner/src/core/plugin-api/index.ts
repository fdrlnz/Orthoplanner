// ═══════════════════════════════════════════
// OrthoPlanner - Plugin API
// Interfaccia che ogni plugin deve implementare
// ═══════════════════════════════════════════

/**
 * Manifest di un plugin - descrive il plugin e le sue dipendenze
 */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  dependencies?: string[];   // ID di altri plugin richiesti
  coreVersion?: string;       // Versione minima del core richiesta
}

/**
 * Interfaccia che ogni plugin deve implementare
 * Il core chiama questi metodi durante il lifecycle del plugin
 */
export interface OrthoPlugin {
  manifest: PluginManifest;

  /** Chiamato quando il plugin viene caricato */
  onLoad(): void;

  /** Chiamato quando il plugin viene attivato dall'utente */
  onActivate(): void;

  /** Chiamato quando l'utente passa a un altro modulo */
  onDeactivate(): void;

  /** Chiamato quando il plugin viene scaricato */
  onUnload(): void;

  /** Restituisce il componente React per il pannello sidebar del plugin */
  getSidebarPanel?(): React.ComponentType;

  /** Restituisce il componente React per il viewport overlay del plugin */
  getViewportOverlay?(): React.ComponentType;

  /** Restituisce i tool 3D (strumenti interattivi nella scena) del plugin */
  getTools?(): PluginTool[];
}

/**
 * Tool 3D di un plugin - uno strumento interattivo nella viewport
 */
export interface PluginTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  onActivate(): void;
  onDeactivate(): void;
}

/**
 * Registry dei plugin - gestisce il caricamento e l'attivazione
 */
export class PluginRegistry {
  private plugins: Map<string, OrthoPlugin> = new Map();

  register(plugin: OrthoPlugin): void {
    this.plugins.set(plugin.manifest.id, plugin);
    plugin.onLoad();
    console.log(`[PluginRegistry] Plugin caricato: ${plugin.manifest.name} v${plugin.manifest.version}`);
  }

  activate(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.onActivate();
    }
  }

  deactivate(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.onDeactivate();
    }
  }

  getPlugin(pluginId: string): OrthoPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): OrthoPlugin[] {
    return Array.from(this.plugins.values());
  }
}

// Istanza globale del registry
export const pluginRegistry = new PluginRegistry();
