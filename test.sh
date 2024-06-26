#!/bin/sh

curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"fen\": \"r4rk1/p2qn1pp/2pbbp2/3pp3/4P3/Q1Nn1N2/P1PBBPPP/R4RK1 w - - 0 14\"}" \
  "http://localhost:8080"
 
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"fen\": \"r1bq1bnr/ppp2kpp/2np4/8/4P3/2N2N2/PB3PPP/R2QK2R b KQ - 1 8\"}" \
  "http://localhost:8080"
