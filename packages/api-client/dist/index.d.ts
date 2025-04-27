import type { UploadThingRouter } from '@jigsaw/server/uploadthing';
declare const client: {
    api: {
        uploadthing: {
            "**": import("hono/client").ClientRequest<{}>;
        };
    };
} & {
    api: {
        "*": import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            } | {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            };
        }>;
    };
} & {
    api: import("hono/client").ClientRequest<{
        $get: {
            input: {};
            output: {
                status: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        "*": import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            } | {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            };
        }>;
    };
} & {
    api: {
        auth: {
            "*": import("hono/client").ClientRequest<{
                [x: `$${Lowercase<string>}`]: {
                    input: {};
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        "*": import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            } | {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            };
        }>;
    };
} & {
    api: {
        game: {
            builder: {
                path: import("hono/client").ClientRequest<{
                    $post: {
                        input: {
                            json: {
                                pieceSize: number;
                                rows: number;
                                origin: {
                                    x: number;
                                    y: number;
                                };
                                cols: number;
                            };
                        };
                        output: {
                            success: boolean;
                            data: {
                                paths: {
                                    horizontal: string[];
                                    vertical: string[];
                                };
                                pieceFootprint: number;
                            };
                        };
                        outputFormat: "json";
                        status: import("hono/utils/http-status").ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    api: {
        game: {
            builder: import("hono/client").ClientRequest<{
                $post: {
                    input: {
                        json: {
                            columns: number;
                            imageKey: string;
                            difficulty: "easy" | "medium" | "hard";
                            pieceCount: "12" | "50" | "100" | "200" | "500" | "1000";
                            pieceSize: number;
                            rows: number;
                            origin: {
                                x: number;
                                y: number;
                            };
                            borders: boolean;
                            cached?: {
                                horizontalPaths: string[];
                                verticalPaths: string[];
                                pieceFootprint: number;
                            } | undefined;
                        };
                    };
                    output: {
                        success: boolean;
                        gameId: number | undefined;
                        pieces: {
                            row: number;
                            col: number;
                            width: number;
                            height: number;
                            file: {
                                readonly lastModified: number;
                                readonly name: string;
                                readonly webkitRelativePath: string;
                                readonly size: number;
                                readonly type: string;
                                slice: {};
                            };
                        }[];
                        svg: string[][];
                    };
                    outputFormat: "json";
                    status: import("hono/utils/http-status").ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        game: {
            ":id": import("hono/client").ClientRequest<{
                $get: {
                    input: {
                        param: {
                            id: string;
                        };
                    };
                    output: {
                        game: {
                            pieces: {
                                uploadedImage: {
                                    url: string;
                                    imageKey: string;
                                };
                                id: number;
                                createdAt: string;
                                updatedAt: string;
                                gameId: number;
                                uploadedImageId: number;
                                row: number;
                                col: number;
                            }[];
                            id: number;
                            createdAt: string;
                            updatedAt: string;
                            columns: number;
                            imageKey: string;
                            difficulty: "easy" | "medium" | "hard";
                            pieceCount: number;
                            hasBorders: boolean;
                            horizontalPaths: string[];
                            verticalPaths: string[];
                            pieceSize: number;
                            pieceFootprint: number;
                            rows: number;
                            uploadedImage: {
                                id: number;
                                createdAt: string;
                                updatedAt: string;
                                userId: string;
                                imageKey: string;
                                width: number;
                                height: number;
                                isPiece: boolean;
                                gameId: number | null;
                            };
                        };
                    };
                    outputFormat: "json";
                    status: import("hono/utils/http-status").ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        "*": import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            } | {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            };
        }>;
    };
} & {
    api: {
        uploadthing: import("hono/client").ClientRequest<{
            $all: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            };
        }>;
    };
} & {
    api: {
        "*": import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            } | {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
            };
        }>;
    };
};
export type Client = typeof client;
export declare const clientWithType: (baseUrl: string, options?: import("hono/client").ClientRequestOptions | undefined) => Client;
export type UploadRouter = UploadThingRouter;
export {};
//# sourceMappingURL=index.d.ts.map