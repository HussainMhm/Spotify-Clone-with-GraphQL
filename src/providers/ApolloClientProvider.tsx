import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

const client = new ApolloClient({
    uri: "https://northridgeville.stepzen.net/api/famous-hyena/__graphql",
    headers: {
        Authorization:
            "apikey northridgeville::stepzen.net+1000::5e7795abb5454ad9731a0e1e886fe3f3df8c34c0733b7651b90f73d419a036c1",
    },
    cache: new InMemoryCache(),
});

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
