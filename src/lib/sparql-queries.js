export const PREFIXES = `
    PREFIX peps: <https://www.phylogenyexplorerproject.com/schema/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
`;

export const QUERY_COUNT_CLASSES = `
    ${PREFIXES}
    SELECT ?class (count(?o) as ?count) 
    WHERE {
        ?s rdf:type/skos:prefLabel ?class .
        ?s skos:prefLabel ?o
    }
    GROUP BY ?class order by desc(?count)
`;

export const QUERY_MRCA = `
    ${PREFIXES}
    SELECT DISTINCT ?lastCommonAncestor ?lastCommonAncestorLabel
    WHERE {
        ?lastCommonAncestor skos:prefLabel ?lastCommonAncestorLabel ;
  					        ^rdfs:subClassOf ?interNode1 ;
                            ^rdfs:subClassOf ?interNode2 .
        ?interNode1 ^rdfs:subClassOf+ $SunConure .
        ?interNode2 ^rdfs:subClassOf+ $Chimpanzee .

        BIND(<https://www.phylogenyexplorerproject.com/tree/ott851008> as $SunConure)
        BIND(<https://www.phylogenyexplorerproject.com/tree/ott417950> as $Chimpanzee)
        FILTER (?interNode1 != ?interNode2)
    }
`;

export const QUERY_IMAGE_URL = `
    ${PREFIXES}
    SELECT * WHERE { ?s peps:imageURL ?o } LIMIT 10
`;

export const QUERY_HABITAT_RANGE = `
    ${PREFIXES}
    SELECT * WHERE {?s peps:habitatRange ?o } LIMIT 10
`;

export const QUERY_CONSERVATION_STATUS = `
    ${PREFIXES}
    SELECT * WHERE {?s peps:conservationStatus ?o} LIMIT 10
`;
