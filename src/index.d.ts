declare module "always-tail" {
    export interface TailOptions {
        separator?: string | RegExp | null | undefined;
        fromBeginning?: boolean | undefined;
        fsWatchOptions?: Record<string, any> | undefined;
        follow?: boolean | undefined;
        logger?: any;
        encoding?: string | undefined;
        useWatchFile?: boolean | undefined;
        flushAtEOF?: boolean | undefined;
        nLines?: number | undefined;
    }

    declare class Tail {
        /** Creates a new Tail object that starts watching the specified file immediately. */
        constructor(filename: string, separators: string, options?: TailOptions);
        /** Callback to listen for newlines appended to file */
        on(eventType: "line", cb: (data: any) => void): void;
        /** Error callback */
        on(eventType: "error", cb: (error: any) => void): void;
        /** Stop watching file */
        unwatch(): void;
        /** Start watching file if previously stopped */
        watch(): void;
    }

    export default Tail
};
