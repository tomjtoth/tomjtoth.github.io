class Lyrics {
    static EMOJI = {
        YOUTUBE: `<svg height="16" viewBox="0 0 28.57 20" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
            <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
          </g>
        </svg>`,

        TRANSLATE: `<svg width="16" heigth="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z">
            </path>
        </svg>
        `
    }

    static {

        const new_li = (
            txt,
            url = null,
            needs_ul = true,
            lyrics = null,
            title = 'open playlist',
            needs_help = false
        ) => {
            // const repl = (txt) => txt.replaceAll(/[^\p{L}\d\/]+/gu, '-');
            const li = document.createElement('li');

            // li.id = repl(parent_node.id + '/' + txt);
            li.textContent = txt;

            if (url) {
                const a = document.createElement('a');
                a.innerHTML = this.EMOJI.YOUTUBE;
                a.href = url;
                a.target = '_blank';
                a.title = title;
                li.appendChild(a);
            }

            if (lyrics) {
                const a = document.createElement('a');
                a.innerHTML = this.EMOJI.TRANSLATE;
                a.href = `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(lyrics)}&op=translate`;
                a.target = '_blank';
                a.title = 'open lyrics in Google Translate';
                li.appendChild(a);

                const original_lyrics = document.createElement('ul');
                original_lyrics.textContent = lyrics;
                original_lyrics.style.whiteSpace = 'pre-line'
                li.appendChild(original_lyrics);
            }

            if (needs_ul)
                li.appendChild(document.createElement('ul'));

            if (needs_help)
                li.classList.add('help-wanted');

            return li;
        }

        const search_on_yt = (artist, song) =>
            'https://www.youtube.com/results?search_query=' + encodeURIComponent(artist + ' - Topic ' + song);

        const ul_songs = document.querySelector('div#lyrics > ul#songs');

        ul_songs.addEventListener('click', ({ target: { tagName, classList } }) => {
            if (tagName !== 'LI') return;
            classList.toggle('active');
        });

        // TODO: <a href="link to google translate or no href at all">song name</a><a href="link to youtube">'🎶'</a> 🎤👨‍🎤▶️

        fetch('lyrics.yaml').then(res => res.text()).then(data => {
            for (const [artist_name, { url, ...albums }] of Object.entries(jsyaml.load(data)).sort((a, b) => {
                if (a[0] < b[0]) return -1;
                if (a[0] > b[0]) return 1;
                return 0;
            })) {
                const li_artist = new_li(artist_name, url)

                for (const [album_name, { year, url, ...songs }] of Object.entries(albums).sort((a, b) => {
                    if (typeof a.year === 'undefined' || a.year < b.year) return -1;
                    if (a.year > b.year) return 1;
                    return 0;
                })) {
                    const li_album = new_li(album_name === 'null'
                        ? 'mix'
                        : album_name + ' - ' + year,
                        url
                    );

                    for (let [song_name, lyrics] of Object.entries(songs)) {

                        let
                            song_url = null,
                            song_title,
                            song_needs_help = false;

                        if (lyrics) {
                            if (lyrics.startsWith('http')) {
                                song_url = lyrics;
                                song_title = 'open track in YouTube';
                                song_needs_help = true;
                                lyrics = null;
                            }
                        } else {
                            song_url = search_on_yt(artist_name, song_name);
                            song_title = 'search for the track on YouTube';
                            song_needs_help = true;
                        }

                        li_album.lastChild.appendChild(new_li(
                            song_name,
                            song_url,
                            false,
                            lyrics,
                            song_title,
                            song_needs_help
                        ));
                    }
                    li_artist.lastChild.appendChild(li_album);
                }
                ul_songs.appendChild(li_artist);
            }

            document.querySelectorAll('ul#songs li:only-child').forEach(li => li.lastChild.classList.add('active'));
            chg_view(view());
        })
    }
}
