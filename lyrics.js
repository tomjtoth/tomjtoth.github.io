class Lyrics {

    static {

        const new_li = function (txt, parent, song = false, embed = null) {
            const li = document.createElement('li');
            const repl = (txt) => txt.replaceAll(/[^\/A-ZÅÄÖ0-9a-zåäö]+/g, '-');

            // artist or album handled here
            if (!song) {
                li.textContent = txt;
                li.id = repl(parent.id + '/' + txt);
                if (true && embed) {
                    const iframe = document.createElement('iframe');
                    iframe.loading = 'lazy';
                    if (embed.youtube) {
                        iframe.width = 400;
                        iframe.height = 315;
                        iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?si=${embed.youtube[0]}&amp;list=${embed.youtube[1]}`;
                        iframe.title = "YouTube video player";
                        iframe.frameborder = 0;
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        iframe.setAttribute('allowfullscreen', true);
                    }
                    if (embed.bandcamp) {
                        iframe.style = "border: 0; width: 400px; height: 315px;";
                        iframe.src = `https://bandcamp.com/EmbeddedPlayer/album=${embed.bandcamp}/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/`;
                        iframe.setAttribute('seamless', true);
                    }
                    li.appendChild(document.createElement('br'));
                    li.appendChild(iframe);
                }
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

        const search_on_yt = (artist, song) => `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + ' - Topic ' + song)}`

        const wip_or_help = (wip, a, li, linked_to_yt = false) => {
            if (wip) {
                a.title = 'WiP since '
                    + new Date(wip).toLocaleString()
                    + '.\nPlease, pick another one!';
                li.classList.add('wip');
            } else {
                a.title = (linked_to_yt ? 'open in' : 'search on') + ' YouTube';
                li.classList.add('help-wanted');
            }
        };

        const ul_songs = document.querySelector('div#lyrics > ul#songs');

        const re_yt = /^https:\/\/(?:youtu\.be|www\.youtube\.com)/;

        /*
        ul_songs.addEventListener('click', ({ target: { id, tagName } }) => {
            if (tagName !== 'A') return;
            history.pushState({}, '', '#' + id);
        });
        */

        fetch('lyrics.yaml').then(res => res.text()).then(data => {
            for (const [art_name, { embed = null, ...albums }] of Object.entries(jsyaml.load(data))) {
                const li_art = new_li(art_name, ul_songs.parentNode, false, embed)

                for (const [alb_name, { year, embed, ...songs }] of Object.entries(albums)) {
                    const li_alb = new_li(alb_name == 'null'
                        ? 'mix'
                        : alb_name + ' - ' + year,
                        li_art,
                        false,
                        embed);

                    for (const [sng_name, lyrics] of Object.entries(songs)) {
                        const li_sng = new_li(sng_name, li_alb, true)
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
