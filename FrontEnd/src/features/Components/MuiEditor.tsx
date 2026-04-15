import React from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  RichTextEditorProvider, 
  RichTextField, // Use this instead of RichTextEditor
  MenuControlsContainer, 
  MenuButtonBold, 
  MenuButtonItalic,
  MenuSelectHeading,
  MenuDivider
} from "mui-tiptap";
import { Box, Paper } from "@mui/material";
import { parseHTMLTotext } from "../../Helpers/StringParser";

interface MuiEditorProps {
  initialContent?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
}

export const MuiTextEditor: React.FC<MuiEditorProps> = ({ initialContent = "", onChange }) => {
  // 1. Initialize the editor logic
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(parseHTMLTotext(editor.getHTML()));
    },
  });

  if (!editor) return null;

  return (
    <RichTextEditorProvider editor={editor}>
      <Paper 
        variant="outlined" 
        sx={{ 
          borderRadius: 1, 
          overflow: "hidden",
          borderColor: "divider",
          '&:focus-within': {
            borderColor: 'primary.main',
            borderWidth: '2px',
            margin: '-1px',
          }
        }}
      >
        {/* 3. The Toolbar Area */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "action.hover", p: 0.5 }}>
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
          </MenuControlsContainer>
        </Box>

        {/* 4. The Editable Area */}
        <Box sx={{ p: 1 }}>
          <RichTextField
            // This component consumes the editor from the Provider
            // and won't complain about 'extensions'
            sx={{
              "& .ProseMirror": {
                outline: "none",
                minHeight: "150px",
                padding: "8px",
              }
            }}
          />
        </Box>
      </Paper>
    </RichTextEditorProvider>
  );
};