# Les smart contracts

Pour résumer le fonctionnement des différents smart contracts :

Les contrats "Manager", "Opener", "AddRewards", "MysteryBox" et "MysteryKey" sont des contrats intelligents Solidity qui interagissent pour permettre la création, la gestion et l'ouverture de boîtes mystères contenant des récompenses (NFTs, Tokens).

Ces contrats intelligents sont déployés sur la chaîne Polygon Mumbai.

Ils ont été développés dans un environnement hardhat, testé via ce même environnement grâce au package chai. 

Le contrat "Manager" est responsable en majorité de l’initialisation de chaque nouvelle édition de boîtes mystères, en créant systématiquement un nouveau contrat “MysteryBox” et le nombre de clés associés via le contrat "MysteryKey". 

Il permet d'ajouter de nouvelles récompenses à une boîte mystère spécifique en utilisant le contrat "AddRewards". 

Le contrat "Opener" permet aux utilisateurs d'utiliser des clés de boîtes mystères pour ouvrir une boîte et réclamer les récompenses associées.

Le contrat "MysteryBox" représente une boîte mystère spécifique qui peut contenir des tokens ERC20 et des NFTs.

Le contrat "MysteryKey", représente un contrat ERC-721 et permet de générer une collection de NFT héritant du contrat ERC721 de @openzeppelin. Cette collection représente les différentes clés mystères ouvrant des boites mystères afin de réclamer les récompenses. 

