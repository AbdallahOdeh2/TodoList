# Asset Optimization Guide

## GIF to MP4 Conversion

The following GIF files have been replaced with optimized MP4 videos to improve performance:

### Original GIFs (to be removed):

- add.gif (2.6MB) → add.mp4 (~50KB)
- cancel.gif (1.4MB) → cancel.mp4 (~30KB)
- like.gif (1.8MB) → like.mp4 (~40KB)
- pencil.gif (1.4MB) → pencil.mp4 (~35KB)
- trash.gif (584KB) → trash.mp4 (~25KB)
- pin22.gif (805KB) → pin.mp4 (~20KB)
- completed.gif (549KB) → completed.mp4 (~15KB)

### Conversion Instructions:

1. Use FFmpeg to convert GIFs to optimized MP4:

```bash
ffmpeg -i input.gif -vf "scale=64:64,fps=15" -c:v libx264 -crf 23 -preset fast -movflags +faststart output.mp4
```

2. For even smaller files, use WebM format:

```bash
ffmpeg -i input.gif -vf "scale=64:64,fps=15" -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm
```

3. Create both formats for better browser support:

```bash
# MP4 version
ffmpeg -i input.gif -vf "scale=64:64,fps=15" -c:v libx264 -crf 23 -preset fast -movflags +faststart output.mp4

# WebM version
ffmpeg -i input.gif -vf "scale=64:64,fps=15" -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm
```

### Expected Size Reduction:

- Total original size: ~9.7MB
- Total optimized size: ~215KB
- **Savings: ~9.5MB (98% reduction)**

### Browser Support:

- MP4: All modern browsers
- WebM: Chrome, Firefox, Edge, Safari 14+
