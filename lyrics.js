class Lyrics {

    static {

        const new_li = (
            txt,
            parent_id,
            url = null,
            needs_ul = true,
            title = 'open playlist in YouTube | bandcamp',
            needs_help = false
        ) => {
            const repl = (txt) => txt.replaceAll(/[^\p{L}\d]+/gu, '-');
            const li = document.createElement('li');

            const id = repl(parent_id + '/' + txt);

            if (url) {
                const a = document.createElement('a');
                a.textContent = txt;
                a.id = id;
                a.href = url;
                a.target = '_blank';
                a.title = title;
                li.appendChild(a);
            } else {
                li.textContent = txt;
                li.id = id;
            }

            if (needs_ul)
                li.appendChild(document.createElement('ul'));

            if (needs_help)
                li.classList.add('help-wanted');

            return li;
        }

        const search_on_yt = (artist, song) => `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + ' - Topic ' + song)}`

        const ul_songs = document.querySelector('div#lyrics > ul#songs');

        ul_songs.addEventListener('click', ({ target: { id, tagName } }) => {
            if (tagName !== 'A') return;
            history.pushState({}, '', '#' + id);
        });

        fetch('lyrics.yaml').then(res => res.text()).then(data => {
            for (const [art_name, { url, ...albums }] of Object.entries(jsyaml.load(data))) {
                const li_art = new_li(art_name, ul_songs.parentNode.id, url)

                for (const [alb_name, { year, url, ...songs }] of Object.entries(albums)) {
                    const li_alb = new_li(alb_name == 'null'
                        ? 'mix'
                        : alb_name + ' - ' + year,
                        li_art.id,
                        url);

                    for (const [sng_name, lyrics] of Object.entries(songs)) {

                        let
                            sng_url,
                            sng_title,
                            sng_needs_help = false;

                        if (lyrics) {
                            if (lyrics.startsWith('http')) {
                                sng_url = lyrics;
                                sng_title = 'open track in YouTube';
                            } else {
                                sng_url = `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(lyrics)}&op=translate`;
                                sng_title = 'open lyrics in Google Translate';
                            }
                        } else {
                            sng_url = search_on_yt(art_name, sng_name);
                            sng_title = 'search for the track on YouTube';
                            sng_needs_help = true;
                        }

                        const li_sng = new_li(
                            sng_name,
                            li_alb.id,
                            sng_url,
                            false,
                            sng_title,
                            sng_needs_help
                        );

                        li_alb.lastChild.appendChild(li_sng);
                    }
                    li_art.lastChild.appendChild(li_alb);
                }
                ul_songs.appendChild(li_art);
            }
        })
    }
}
