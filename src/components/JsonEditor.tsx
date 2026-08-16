import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { EditorView, placeholder } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { MAX_JSON_SIZE } from "../constants/limits";

type JsonEditorProps = {
  editable: boolean;
  value: string;
  onChange?: (value: string) => void;
  placeholderText?: string;
  onSizeLimitExceeded?: () => void;
};

export function JsonEditor({
  editable,
  value,
  onChange,
  placeholderText,
  onSizeLimitExceeded,
}: JsonEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        json(),
        oneDark,
        EditorView.editable.of(editable),
        ...(placeholderText ? [placeholder(placeholderText)] : []),

        EditorView.updateListener.of((update) => {
          if (!update.docChanged) {
            return;
          }

          const content = update.state.doc.toString();

          if (new Blob([content]).size > MAX_JSON_SIZE) {
            onSizeLimitExceeded?.();

            const previousValue = valueRef.current;

            update.view.dispatch({
              changes: {
                from: 0,
                to: update.state.doc.length,
                insert: previousValue,
              },
            });

            return;
          }

          valueRef.current = content;
          onChange?.(content);
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;

    if (!view) {
      return;
    }

    const currentValue = view.state.doc.toString();

    if (currentValue === value) {
      return;
    }

    valueRef.current = value;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  }, [value]);

  return <div ref={editorRef} />;
}
