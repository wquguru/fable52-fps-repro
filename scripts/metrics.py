import json,glob,os
P={'in':8,'w5':10,'w1':16,'rd':0.2,'out':40}
H=os.path.dirname(os.path.abspath(__file__)); rows=[]
for f in sorted(glob.glob(os.path.join(H,"..","runs","*.json"))):
    try: d=json.load(open(f))
    except Exception: continue
    mu=d.get('modelUsage') or {}
    g=lambda k:sum(v.get(k,0) for v in mu.values())
    inp,out,rd,cc=g('inputTokens'),g('outputTokens'),g('cacheReadInputTokens'),g('cacheCreationInputTokens')
    w5,w1=g('cacheCreationEphemeral5mInputTokens'),g('cacheCreationEphemeral1hInputTokens')
    tot=inp+cc+rd
    calc=(inp*P['in']+w5*P['w5']+w1*P['w1']+(cc-w5-w1)*P['w5']+rd*P['rd']+out*P['out'])/1e6
    rows.append([os.path.basename(f)[:-5],d.get('duration_ms',0)//1000,d.get('num_turns'),tot,inp,w5,w1,cc-w5-w1,rd,out,
      f"{rd/tot:.1%}" if tot else '-',f"{d.get('total_cost_usd',0):.2f}",f"{calc:.2f}",f"{(tot*P['in']+out*P['out'])/1e6:.2f}",','.join(mu)])
h=['run','sec','turns','input_total','input_uncached','write_5m','write_1h','write_other','cache_read','output','hit_rate','cost_usd','cost_recalc','cost_no_cache','models']
out='\n'.join('\t'.join(map(str,r)) for r in [h]+rows)
open(os.path.join(H,"..","data","metrics.tsv"),'w').write(out+'\n'); print(out)
