declare namespace React {
  type ReactNode = 
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactElement
    | React.ReactFragment
    | React.ReactPortal
    | React.ReactNodeArray;
    
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type Key = string | number;
  
  interface ReactFragment {
    children: ReactNode[];
  }

  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
  
  type ReactNodeArray = Array<ReactNode>;
  
  type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => React.Component<any, any>);
    
  class Component<P = {}, S = {}> {
    constructor(props: P);
    props: P;
    state: S;
    setState(state: S | ((prevState: S, props: P) => S)): void;
    forceUpdate(): void;
    render(): ReactNode;
  }
} 