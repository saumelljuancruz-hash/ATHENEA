import subprocess, glob, sys
d = sys.argv[1]
files = sorted(glob.glob(f'{d}/f*.jpg'))
for k in range(0, len(files), 7):
    g = files[k:k+7]; inp = []
    if len(g) == 1:
        g = g * 2
    for f in g: inp += ['-i', f]
    label = lambda f: f.rsplit('/', 1)[1][1:5]
    filt = ''.join(f"[{i}]drawtext=text='{label(g[i])}':x=10:y=10:fontsize=36:fontcolor=yellow:box=1:boxcolor=black[v{i}];" for i in range(len(g))) + ''.join(f'[v{i}]' for i in range(len(g))) + f'hstack=inputs={len(g)}[o]'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', filt, '-map', '[o]', '-q:v', '4', f'{d}/row{k//7}.jpg'], check=True)
print('ok')
