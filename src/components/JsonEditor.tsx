import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

type JsonEditorProps = {
  editable: boolean;
  value: string;
  onChange?: (value: string) => void;
};

export function JsonEditor({ 
    editable,
    value, 
    onChange, 
}: JsonEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

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

        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                onChange?.(update.state.doc.toString());
  }
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