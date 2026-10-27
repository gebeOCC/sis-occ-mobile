import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { toast } from "sonner-native";

/** Links open in an in-app browser. */
export const openLink = (url: string) => WebBrowser.openBrowserAsync(url);

/**
 * Prototype stubs. For real previews and downloads add expo-file-system + expo-sharing here,
 * so every attachment and material in the app picks them up.
 */
export function previewFile(name: string) {
  Haptics.selectionAsync();
  toast.info(name, { description: "Previews are mocked in this prototype." });
}

export function downloadFile(name: string) {
  Haptics.selectionAsync();
  toast.info(name, { description: "Downloads are mocked in this prototype." });
}
