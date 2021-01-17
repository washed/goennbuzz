<script>
  export let string = "";
</script>

<div>
  {#each string as char, i}
    <span class="glow">{char}</span>
  {/each}
</div>

<style>
  @import url("https://fonts.googleapis.com/css?family=Permanent+Marker");

  span.glow {
    font-family: "Permanent Marker";
    font-size: 1rem;
    animation: glow 1.5s ease-in-out both infinite;
  }

  /* Think about how to address this atrocity */
  span.glow:nth-child(1) {
    animation-delay: -0.09375s;
  }
  span.glow:nth-child(2) {
    animation-delay: -0.1875s;
  }
  span.glow:nth-child(3) {
    animation-delay: -0.28125s;
  }
  span.glow:nth-child(4) {
    animation-delay: -0.375s;
  }
  span.glow:nth-child(5) {
    animation-delay: -0.46875s;
  }
  span.glow:nth-child(6) {
    animation-delay: -0.5625s;
  }
  span.glow:nth-child(7) {
    animation-delay: -0.65625s;
  }
  span.glow:nth-child(8) {
    animation-delay: -0.75s;
  }
  span.glow:nth-child(9) {
    animation-delay: -0.84375s;
  }
  span.glow:nth-child(10) {
    animation-delay: -0.9375s;
  }
  span.glow:nth-child(11) {
    animation-delay: -1.03125s;
  }
  span.glow:nth-child(12) {
    animation-delay: -1.125s;
  }
  span.glow:nth-child(13) {
    animation-delay: -1.21875s;
  }
  span.glow:nth-child(14) {
    animation-delay: -1.3125s;
  }
  span.glow:nth-child(15) {
    animation-delay: -1.40625s;
  }
  span.glow:nth-child(16) {
    animation-delay: -1.5s;
  }

  @keyframes glow {
    0%,
    100% {
      text-shadow: 0 0 1.66667px snow, 0 -3px 10px #f5d300,
        -3px 3px 10px #fe53bb, 3px 3px 10px #f5d300;
    }
    33% {
      text-shadow: 0 0 1.66667px snow, 0 -3px 10px #08f7fe,
        -3px 3px 10px #f5d300, 3px 3px 10px #08f7fe;
    }
    66% {
      text-shadow: 0 0 1.66667px snow, 0 -3px 10px #fe53bb,
        -3px 3px 10px #08f7fe, 3px 3px 10px #fe53bb;
    }
  }
</style>
