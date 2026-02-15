export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 480,
          background: "#ffffff",
          padding: 32,
          borderRadius: 18,
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div style={skeletonTitle} />
        <div style={skeletonInput} />
        <div style={skeletonInput} />
        <div style={skeletonInput} />
        <div style={{ ...skeletonButton, marginTop: 20 }} />
      </div>
    </div>
  );
}

const skeletonBase = {
  background: "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)",
  backgroundSize: "400% 100%",
  animation: "loading 1.4s ease infinite",
  borderRadius: 8,
};

const skeletonTitle = {
  ...skeletonBase,
  height: 24,
  width: "60%",
  marginBottom: 24,
};

const skeletonInput = {
  ...skeletonBase,
  height: 42,
  width: "100%",
  marginBottom: 16,
};

const skeletonButton = {
  ...skeletonBase,
  height: 42,
  width: "100%",
};