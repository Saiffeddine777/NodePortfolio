import React, { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  RichTextEditorProvider,
  RichTextField,
  MenuControlsContainer,
  MenuButtonBold,
  MenuButtonItalic,
  MenuSelectHeading,
  MenuDivider,
} from "mui-tiptap";
import { Box } from "@mui/material";
import { parseHTMLTotext } from "../../Helpers/StringParser";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "mui-editor-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

    /* ── Outer shell ── */
    .me-shell {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.025);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .me-shell:focus-within {
      border-color: rgba(99,102,241,0.5);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }

    /* ── Toolbar ── */
    .me-toolbar {
      border-bottom: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.03);
      padding: 6px 10px;
      display: flex;
      align-items: center;
    }

    /* ── Toolbar button overrides ── */
    .me-toolbar .MuiButtonBase-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      color: rgba(255,255,255,0.45) !important;
      border-radius: 7px !important;
      min-width: unset !important;
      padding: 4px 8px !important;
      transition: background 0.18s ease, color 0.18s ease !important;
    }
    .me-toolbar .MuiButtonBase-root:hover {
      background: rgba(99,102,241,0.1) !important;
      color: #818cf8 !important;
    }
    .me-toolbar .MuiButtonBase-root.Mui-selected,
    .me-toolbar .MuiButtonBase-root[aria-pressed="true"] {
      background: rgba(99,102,241,0.15) !important;
      color: #818cf8 !important;
    }

    /* ── Heading select ── */
    .me-toolbar .MuiSelect-root,
    .me-toolbar .MuiInputBase-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .me-toolbar .MuiOutlinedInput-notchedOutline {
      border-color: transparent !important;
    }
    .me-toolbar .MuiSelect-icon {
      color: rgba(255,255,255,0.3) !important;
    }

    /* ── Divider ── */
    .me-toolbar .MuiDivider-root {
      border-color: rgba(255,255,255,0.08) !important;
      margin: 0 6px !important;
    }

    /* ── Editable area ── */
    .me-editable {
      padding: 12px 16px;
    }
    .me-editable .ProseMirror {
      outline: none;
      min-height: 140px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.75);
      line-height: 1.8;
      caret-color: #818cf8;
    }
    .me-editable .ProseMirror p {
      margin: 0 0 8px;
    }
    .me-editable .ProseMirror h1,
    .me-editable .ProseMirror h2,
    .me-editable .ProseMirror h3 {
      font-family: 'DM Sans', sans-serif;
      color: rgba(255,255,255,0.85);
      font-weight: 600;
      margin: 0 0 10px;
    }
    .me-editable .ProseMirror strong {
      color: rgba(255,255,255,0.88);
      font-weight: 700;
    }
    .me-editable .ProseMirror em {
      color: rgba(255,255,255,0.65);
    }
    /* Placeholder */
    .me-editable .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: rgba(255,255,255,0.18);
      pointer-events: none;
      float: left;
      height: 0;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
interface MuiEditorProps {
  initialContent?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
}

export const MuiTextEditor: React.FC<MuiEditorProps> = ({
  initialContent = "",
  onChange,
}) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(parseHTMLTotext(editor.getHTML()));
    },
  });

  if (!editor) return null;
  // ────────────────────────────────────────────────────────────────────────

  return (
    <RichTextEditorProvider editor={editor}>
      <Box className="me-shell">

        {/* ── Toolbar ── */}
        <Box className="me-toolbar">
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
          </MenuControlsContainer>
        </Box>

        {/* ── Editable area ── */}
        <Box className="me-editable">
          <RichTextField
            sx={{
              "& .ProseMirror": {
                outline: "none",
                minHeight: "140px",
                padding: 0,
              },
            }}
          />
        </Box>

      </Box>
    </RichTextEditorProvider>
  );
};