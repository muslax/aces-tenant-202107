import Head from "next/head";

import Hero from "./Hero";

const PageLoading = ({ project, batch, title, isIndex }) => {
  return <>
    <Head>
      <title>ACES - Loading page...</title>
    </Head>

    <Hero project={project} batch={batch} title={title} isIndex={isIndex} />

    <div id="page-loading" className="flex flex-col justify-center py-8">
      <div className="mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="45px"
        viewBox="5 5 90 90"
        preserveAspectRatio="xMidYMid"
      >
        <g transform="rotate(180 50 50)">
          <rect x="6.111111111111111" y="12.5" width="10" height="30" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.5s"></animate>
          </rect>
          <rect x="17.22222222222222" y="12.5" width="10" height="30" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.75s"></animate>
          </rect>
          <rect x="28.333333333333336" y="12.5" width="10" height="30" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.625s"></animate>
          </rect>
          <rect x="39.44444444444444" y="12.5" width="10" height="30" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.125s"></animate>
          </rect>
          <rect x="50.55555555555556" y="12.5" width="10" height="140" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.375s"></animate>
          </rect>
          <rect x="61.66666666666667" y="12.5" width="10" height="40" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.25s"></animate>
          </rect>
          <rect x="72.77777777777777" y="12.5" width="10" height="40" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="0s"></animate>
          </rect>
          <rect x="83.88888888888889" y="12.5" width="10" height="40" fill="rgba(191, 219, 254, 0.75)">
            <animate attributeName="height" calcMode="spline" values="50;75;10;50" times="0;0.33;0.66;1" dur="1s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.875s"></animate>
          </rect>
        </g>
      </svg>
      </div>
    </div>
  </>
}

export default PageLoading
