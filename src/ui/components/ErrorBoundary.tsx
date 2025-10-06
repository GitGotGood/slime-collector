import React from "react";

type Props = {
  children: React.ReactNode;
  label?: string;
};

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    if (import.meta.env.DEV) {
      console.error("🧯 Slime ErrorBoundary:", { label: this.props.label, error, info });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid place-items-center w-full h-full">
          <div className="text-xs text-emerald-700/70">Rendering error. Showing placeholder.</div>
        </div>
      );
    }
    return this.props.children as any;
  }
}


