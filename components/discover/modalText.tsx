import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ModalText() {
  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.text}>
        Dans l’onglet “Découverte”, nous découvrons à l’aveugle des extraits de
        titres musicaux via une “roue” virtuelle ludique et aléatoire. Cela nous
        permet de nous concentrer sur le talent musical “brut” de l’artiste
        avant de découvrir son apparence, son nom ...etc.
      </Text>
      <View style={{ marginTop: 10 }}></View>
      <Text style={styles.text}>
        Afin de diversifier nos écoutes, la découverte “pure” est préconisée,
        même s’il est possible de décocher les genres musicaux que nous ne
        voulons pas écouter via les paramètres de notre roue dans l’onglet “Mon
        Profil’.
      </Text>
      <Text style={styles.text}>
        Lorsque nous scrollons vers le haut, nous passons à l’extrait musical
        suivant qui se lance automatiquement. Nous pouvons scroller vers le bas
        pour revenir à l’extrait musical précédent.
      </Text>
      <View style={{ marginTop: 10 }}></View>
      <Text style={styles.text}>
        Pour chaque extrait musical, nous pouvons également :
      </Text>
      <View style={{ marginTop: 10 }}></View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.text}>• </Text>
        <Text style={[{ flex: 1 }, styles.text]}>
          Soit le swiper vers la gauche, si nous ne l’apprécions pas, afin de le
          supprimer définitivement de notre “roue” virtuelle.
        </Text>
      </View>
      <View style={{ marginTop: 10 }}></View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.text}>• </Text>
        <Text style={[{ flex: 1 }, styles.text]}>
          Soit au contraire le swiper vers la droite, si nous l’apprécions, afin
          de l’ajouter à nos titres “favoris”, pouvoir l’écouter en intégralité,
          puis soutenir et découvrir l’artiste qui en est l’auteur.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "PoppinsRegular",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "justify",
  },
  scrollView: {
    padding: 10,
  },
});
