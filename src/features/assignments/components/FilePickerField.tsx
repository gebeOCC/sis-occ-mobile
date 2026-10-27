import type { Assignment, SubmissionFile } from "@/features/assignments/types";
import * as DocumentPicker from "expo-document-picker";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { formatBytes } from "@/lib/format";
import colors from "@/theme/colors";

/** File upload control for file-based assignments. Validation lives in schema.ts. */
export function FilePickerField({
  value,
  onChange,
  error,
  assignment,
  currentFile,
}: {
  value?: SubmissionFile | null;
  onChange: (file: SubmissionFile | null) => void;
  error?: string;
  assignment: Assignment;
  currentFile?: SubmissionFile;
}) {
  const formats = (assignment.allowedFormats ?? [])
    .map((format) => format.toUpperCase())
    .join(", ");
  const rules = `Accepted: ${formats} · up to ${assignment.maxFileSizeMb} MB`;

  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return;
    const [asset] = result.assets;
    onChange({
      name: asset.name,
      size: asset.size ?? 0,
      mimeType: asset.mimeType ?? "",
      uri: asset.uri,
    });
  };

  return (
    <View className="gap-1.5">
      <Text className="text-[13px] font-semibold text-ink">File</Text>

      {value ? (
        <View className="min-h-[56px] flex-row items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
          <Icon name="file" size={20} />
          <View className="flex-1">
            <Text numberOfLines={1} className="text-[14px] font-medium text-ink">
              {value.name}
            </Text>
            <Text className="text-[12px] text-ink-muted">{formatBytes(value.size)}</Text>
          </View>
          <Pressable
            onPress={() => onChange(null)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${value.name}`}
            className="h-10 w-10 items-center justify-center"
          >
            <Icon name="close" size={18} color={colors.ink.soft} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={pick}
          accessibilityRole="button"
          accessibilityLabel="Choose a file to upload"
          className={`min-h-[96px] items-center justify-center gap-1.5 rounded-xl border border-dashed bg-brand-50 active:opacity-80 ${
            error ? "border-danger-500" : "border-brand-200"
          }`}
        >
          <Icon name="upload" size={22} />
          <Text className="text-[14px] font-semibold text-brand-700">Choose a file</Text>
        </Pressable>
      )}

      {error ? (
        <Text className="text-[12px] text-danger-600">{error}</Text>
      ) : (
        <Text className="text-[12px] text-ink-muted">
          {currentFile ? `Current file: ${currentFile.name}. ${rules}` : rules}
        </Text>
      )}
    </View>
  );
}
