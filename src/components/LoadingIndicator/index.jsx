export default function LoadingIndicator(props) {
  const { type = "default" } = props;
  if ("default" == type) {
    return (
      <div class="shimmer-wrapper">
        <div class="shimmer-circle shimmer-circle-md shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-40 shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-60 shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-80 shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
      </div>
    );
  }
  if ("table" == type) {
    return (
      <div class="shimmer-wrapper">
        <div class="shimmer-line shimmer-line-br shimmer-line-60 shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-80 shimmer-animate"></div>
      </div>
    );
  }
  if ("table-full" == type) {
    return (
      <div class="shimmer-wrapper">
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
        <div class="shimmer-line shimmer-line-br shimmer-line-full shimmer-animate"></div>
      </div>
    );
  }
}
