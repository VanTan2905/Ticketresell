declare var grecaptcha: {
  reset: (widgetId?: string) => void;
  render: (element: HTMLElement, options: any) => number;
  getResponse: (widgetId?: string) => string;
};
