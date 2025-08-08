<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Website][website-shield]][website-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Scroll Song App</h3>

  <p align="center">
Music discovery app for Android and iOS
    <br />
    <a href="https://portfolio-v2-puce-ten.vercel.app/projects/6894cf5ea0015ad7984b5ca8"><strong>Explore the docs</strong></a>
    <br />
    <br />
    <a href="https://github.com/vlanp/scroll-song-frontend/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

Mobile music discovery app offering 30-second clips in a vertical scrollable format, inspired by TikTok and YouTube Shorts, but entirely dedicated to music. Users personalize their experience by selecting their favorite musical genres, so they're only presented with clips that match their tastes. With a simple swipe, they can add their favorites to save them in their personal library and access the full tracks anytime.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![TypeScript][TypeScript]][TypeScript-url]
- [![Axios][Axios]][Axios-url]
- [![Expo][Expo]][Expo-url]
- [![React Native][React-Native]][React-Native-url]
- [![React][React.js]][React-url]
- [![Zustand][Zustand]][Zustand-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Try it

1. Install Node.js version manager
   - For Windows : Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
   - For Linux and MacOS : Download and install **_nvm_** by lauching a script using **_curl_**
     ```sh
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
     ```
2. Install latest version of Node.js and npm
   ```sh
   nvm install latest
   ```
3. Use the latest version of Node.js and npm
   ```sh
   nvm use <version>
   ```
4. Clone the repository
   ```sh
   git clone https://github.com/vlanp/scroll-song-frontend.git
   ```
5. Enter the project folder
   ```sh
   cd scroll-song-frontend
   ```
6. Install all the dependencies
   ```sh
   npm i
   ```
7. Generate and install a developpement build on either iOS or Android
   physical or emulated device by following this [instructions](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local)

> [!NOTE]
> The application may be slower on emulated device than in physical device depending on your configuration. You may prefer to use a physical device.

> [!NOTE]
> For emulated Android device, I found the app working better in API 27

> [!NOTE]
> If for some reason you can't connect your device to install a developpement build, you can try to generate an apk (only for Android) and launch this apk on your device to install the app.  
> For this, you need to launch the following commands in the project folder
>
> ```sh
> npx expo prebuild
> ```
>
> ```sh
> cd android && gradlew assembleRelease
> ```
>
> You can retrieve the apk here : android/app/build/outputs/apk/release/app-release.apk

<!-- LICENSE -->

## License

Distributed under the unlicense license. See `license.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Valentin GUILLAUME - vguillaumedev@gmail.com

Project Link: [https://github.com/vlanp/scroll-song-frontend](https://github.com/vlanp/scroll-song-frontend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/vlanp/scroll-song-frontend.svg?style=for-the-badge
[contributors-url]: https://github.com/vlanp/scroll-song-frontend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vlanp/scroll-song-frontend.svg?style=for-the-badge
[forks-url]: https://github.com/vlanp/scroll-song-frontend/network/members
[stars-shield]: https://img.shields.io/github/stars/vlanp/scroll-song-frontend.svg?style=for-the-badge
[stars-url]: https://github.com/vlanp/scroll-song-frontend/stargazers
[issues-shield]: https://img.shields.io/github/issues/vlanp/scroll-song-frontend.svg?style=for-the-badge
[issues-url]: https://github.com/vlanp/scroll-song-frontend/issues
[license-shield]: https://img.shields.io/github/license/vlanp/scroll-song-frontend.svg?style=for-the-badge
[license-url]: https://github.com/vlanp/scroll-song-frontend/blob/master/license.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/valentin-guillaume-b3b9742ab
[website-shield]: https://img.shields.io/badge/-Website-black.svg?style=for-the-badge&colorB=555
[website-url]: https://portfolio-v2-puce-ten.vercel.app/
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge
[TypeScript-url]: https://www.typescriptlang.org/
[Axios]: https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff&style=for-the-badge
[Axios-url]: https://axios-http.com/
[Zustand]: https://img.shields.io/badge/Zustand-FF6B35.svg?style=for-the-badge&logo=data:image/png;base64,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
[Zustand-url]: https://zustand.docs.pmnd.rs/getting-started/introduction
[Expo]: https://img.shields.io/badge/Expo-1C2024?logo=expo&logoColor=fff&style=for-the-badge
[Expo-url]: https://expo.dev/
[React-Native]: https://img.shields.io/badge/React%20Native-087EA4?logo=react&logoColor=000&style=for-the-badge
[React-Native-url]: https://reactnative.dev/
