class Lyrics {

    static li(txt, parent, song = false) {
        const li = document.createElement('li');
        const repl = (txt) => txt.replaceAll(/[^\/A-ZÅÄÖ0-9a-zåäö]+/g, '-');

        // artist or album handled here
        if (!song) {
            li.textContent = txt;
            li.id = repl(parent.id + '/' + txt);
            li.appendChild(document.createElement('ul'));
        }

        // songs handled here
        else {
            const a = document.createElement('a');
            a.textContent = txt;
            a.id = repl(parent.id + '/' + txt);
            li.appendChild(a);
        };

        return li;
    }

    static {

        const ul_songs = document.querySelector('div#lyrics > ul#songs');

        const re_yt = /^https:\/\/(?:youtu\.be|www\.youtube\.com)/;

        const search_on_yt = (artist, song) => `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + ' - Topic ' + song)}`

        const wip_or_help = (wip, a, li, linked_to_yt = false) => {
            if (wip) {
                a.title = 'WiP since '
                    + new Date(wip).toLocaleString()
                    + '. Please, pick another one';
                li.classList.add('wip');
            } else {
                a.title = (linked_to_yt ? 'open in' : 'search on') + ' YouTube';
                li.classList.add('help-wanted');
            }
        };

        ul_songs.addEventListener('click', ({ target: { id, tagName } }) => {
            if (tagName !== 'A') return;
            history.pushState({}, '', '#' + id);
        });

        fetch('lyrics.yaml').then(res => res.text()).then(data => {
            for (const [art_name, albums] of Object.entries(jsyaml.load(data))) {
                const li_art = this.li(art_name, ul_songs.parentNode);

                for (const [alb_name, { year, ...songs }] of Object.entries(albums)) {
                    const li_alb = this.li(alb_name == 'null'
                        ? 'mix'
                        : alb_name + ' - ' + year,
                        li_art);

                    for (const [sng_name, lyrics] of Object.entries(songs)) {
                        const li_sng = this.li(sng_name, li_alb, true)
                        const a_sng = li_sng.lastChild;
                        a_sng.target = '_blank';

                        if (lyrics) {
                            if (typeof lyrics === 'object') {
                                wip_or_help(
                                    lyrics.hasOwnProperty('wip')
                                        ? lyrics.wip
                                        : null,
                                    a_sng,
                                    li_sng,
                                    lyrics.hasOwnProperty('url')
                                        ? lyrics.url.match(re_yt)
                                        : false
                                );
                                a_sng.href = lyrics.hasOwnProperty('url')
                                    ? lyrics.url
                                    : search_on_yt(art_name, sng_name);
                            } else if (lyrics.match(re_yt)) {
                                wip_or_help(null, a_sng, li_sng, true);
                                a_sng.href = lyrics;
                            } else {
                                a_sng.href = lyrics.match(re_yt)
                                    ? search_on_yt(art_name, sng_name)
                                    : `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(lyrics)}&op=translate`;
                                a_sng.title = 'open in Google Translate';
                            }
                        } else {
                            a_sng.href = search_on_yt(art_name, sng_name);
                            wip_or_help(null, a_sng, li_sng);
                        }
                        li_alb.lastChild.appendChild(li_sng);
                    }
                    li_art.lastChild.appendChild(li_alb);
                }
                ul_songs.appendChild(li_art);
            }
        })
    }
}
