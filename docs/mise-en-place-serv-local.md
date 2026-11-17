# Mettre le projet en réseau local

Pour que les autres joueurs voient le site, il faut trois choses :
- un serveur qui écoute sur le réseau ;
- une seule adresse pour le front et l'API ;
- un réseau qui laisse passer les connexions.

## Étape 0 : tester le réseau du PC

1. Depuis le terminal de l'IDE, écrire cette commande et la laisser tourner :

   ```
   node -e "require('http').createServer((q,r)=>r.end('ok')).listen(3000,'0.0.0.0')"
   ```

2. Dans un autre terminal, écrire :

   ```
   ipconfig
   ```

3. Récupérer l'adresse IPv4 de la carte Ethernet. Par exemple :

   ```
   Adresse IPv4. . . . . . . . . . . . . .: 10.229.32.202
   ```

4. Donner cette adresse à un camarade sur le même réseau, avec ce format :

   ```
   http://<adresse>:3000
   ```