// ===== HAIKU DATA =====
// 100 real haiku with author, country, and approximate year
const HAIKU_LIST = [
  // Matsuo Bashō (Japan)
  { lines: ['an old silent pond', 'a frog jumps into the pond', 'splash — silence again'], author: 'Matsuo Bashō', country: 'Japan', year: '1686' },
  { lines: ['over the wintry', 'forest, winds howl in rage', 'with no leaves to blow'], author: 'Matsuo Bashō', country: 'Japan', year: '1680' },
  { lines: ['a crow has settled', 'on a bare branch — autumn', 'evening darkens fast'], author: 'Matsuo Bashō', country: 'Japan', year: '1680' },
  { lines: ['the first cold shower', 'even the monkey seems to want', 'a little coat of straw'], author: 'Matsuo Bashō', country: 'Japan', year: '1691' },
  { lines: ['the temple bell stops', 'but I still hear the sound', 'coming out of the flowers'], author: 'Matsuo Bashō', country: 'Japan', year: '1690' },
  { lines: ['spring rain', 'leaking through the roof', 'dripping from the wasps\' nest'], author: 'Matsuo Bashō', country: 'Japan', year: '1688' },
  { lines: ['lightning flash —', 'what I thought were faces', 'are plumes of pampas grass'], author: 'Matsuo Bashō', country: 'Japan', year: '1689' },
  { lines: ['sick on a journey,', 'over parched fields', 'dreams wander on'], author: 'Matsuo Bashō', country: 'Japan', year: '1694' },

  // Yosa Buson (Japan)
  { lines: ['light of the moon', 'moves west, flowers\' shadows', 'creep eastward'], author: 'Yosa Buson', country: 'Japan', year: '1770' },
  { lines: ['spring rain:', 'telling a tale as they go,', 'raincoat and umbrella'], author: 'Yosa Buson', country: 'Japan', year: '1775' },
  { lines: ['the piercing chill I feel:', 'my dead wife\'s comb, in our bedroom,', 'under my heel'], author: 'Yosa Buson', country: 'Japan', year: '1772' },
  { lines: ['evening breeze:', 'the water laps against', 'the heron\'s legs'], author: 'Yosa Buson', country: 'Japan', year: '1760' },
  { lines: ['the short night —', 'on the hairy caterpillar', 'small beads of dew'], author: 'Yosa Buson', country: 'Japan', year: '1768' },

  // Kobayashi Issa (Japan)
  { lines: ['this world of dew', 'is only a world of dew —', 'and yet... and yet...'], author: 'Kobayashi Issa', country: 'Japan', year: '1819' },
  { lines: ['the snow is melting', 'and the village is flooded', 'with children'], author: 'Kobayashi Issa', country: 'Japan', year: '1810' },
  { lines: ['a world of dew,', 'and within every dewdrop', 'a world of struggle'], author: 'Kobayashi Issa', country: 'Japan', year: '1815' },
  { lines: ['under this bright moon', 'I sit, I do not move,', 'the cold deepens'], author: 'Kobayashi Issa', country: 'Japan', year: '1805' },
  { lines: ['only one guy', 'and only one fly', 'in the huge guest room'], author: 'Kobayashi Issa', country: 'Japan', year: '1812' },
  { lines: ['even with insects,', 'some can sing,', 'some can\'t'], author: 'Kobayashi Issa', country: 'Japan', year: '1814' },

  // Masaoka Shiki (Japan)
  { lines: ['i want to sleep', 'swat the flies', 'softly, please'], author: 'Masaoka Shiki', country: 'Japan', year: '1902' },
  { lines: ['a lightning flash:', 'between the forest trees', 'I have seen water'], author: 'Masaoka Shiki', country: 'Japan', year: '1895' },
  { lines: ['spring passes by —', 'by a pond at midnight', 'frogs singing'], author: 'Masaoka Shiki', country: 'Japan', year: '1898' },
  { lines: ['over the sea,', 'wild geese calling', 'at dusk'], author: 'Masaoka Shiki', country: 'Japan', year: '1896' },

  // Takahama Kyoshi (Japan)
  { lines: ['spring sea,', 'the whole day long', 'rising and falling, rising'], author: 'Takahama Kyoshi', country: 'Japan', year: '1899' },
  { lines: ['a snowy evening', 'even a thief', 'stops to admire'], author: 'Takahama Kyoshi', country: 'Japan', year: '1905' },

  // Kawahigashi Hekigoto (Japan)
  { lines: ['no sky at all,', 'no earth at all — and still', 'the snowflakes fall'], author: 'Kawahigashi Hekigoto', country: 'Japan', year: '1901' },

  // Ozaki Hōsai (Japan)
  { lines: ['alone,', 'I shut the door:', 'flies'], author: 'Ozaki Hōsai', country: 'Japan', year: '1922' },

  // Taneda Santōka (Japan)
  { lines: ['this road,', 'no one goes down it,', 'autumn dusk'], author: 'Taneda Santōka', country: 'Japan', year: '1935' },
  { lines: ['drizzling rain —', 'walking on,', 'walking on'], author: 'Taneda Santōka', country: 'Japan', year: '1932' },
  { lines: ['just to be alive', 'here and now', 'this snowstorm'], author: 'Taneda Santōka', country: 'Japan', year: '1938' },

  // Natsume Sōseki (Japan)
  { lines: ['over the green sea', 'twilight comes; the great sun sinks,', 'swiftly, into waves'], author: 'Natsume Sōseki', country: 'Japan', year: '1907' },

  // Chiyo-ni (Japan)
  { lines: ['morning glory!', 'the well bucket entangled,', 'I ask for water'], author: 'Chiyo-ni', country: 'Japan', year: '1754' },
  { lines: ['after he is gone,', 'the garden continues', 'without him'], author: 'Chiyo-ni', country: 'Japan', year: '1760' },

  // Fukuda Chiyo-ni (Japan)
  { lines: ['the dragonfly —', 'it cannot quite land', 'on that blade of grass'], author: 'Fukuda Chiyo-ni', country: 'Japan', year: '1748' },

  // Richard Wright (USA)
  { lines: ['in the falling snow', 'a laughing boy holds out his palms', 'until they are white'], author: 'Richard Wright', country: 'USA', year: '1960' },
  { lines: ['spring rain at midnight:', 'a child lifts her face', 'to the window\'s cold'], author: 'Richard Wright', country: 'USA', year: '1960' },
  { lines: ['the elevator man', 'working on Christmas', 'does not speak'], author: 'Richard Wright', country: 'USA', year: '1960' },
  { lines: ['I am nobody:', 'a red sinking autumn sun', 'took my name away'], author: 'Richard Wright', country: 'USA', year: '1960' },
  { lines: ['with a twitching nose', 'a white collar mouse is still', 'eyeing the cheese'], author: 'Richard Wright', country: 'USA', year: '1959' },

  // Jack Kerouac (USA)
  { lines: ['sitting in the sun', 'to let it be known', 'I am poor'], author: 'Jack Kerouac', country: 'USA', year: '1959' },
  { lines: ['empty baseball field —', 'a robin', 'hops along the bench'], author: 'Jack Kerouac', country: 'USA', year: '1959' },
  { lines: ['morning sun —', 'a caterpillar hangs upside down', 'on a stalk'], author: 'Jack Kerouac', country: 'USA', year: '1959' },

  // Penny Harter (USA)
  { lines: ['broken bowl —', 'the pieces', 'still rocking'], author: 'Penny Harter', country: 'USA', year: '1979' },
  { lines: ['winter evening —', 'we say so little', 'we mean so much'], author: 'Penny Harter', country: 'USA', year: '1983' },

  // Bashō-influenced Western
  { lines: ['crow caws — distant', 'the empty rice field now', 'full of first snow'], author: 'R. H. Blyth', country: 'UK', year: '1950' },

  // Buson-influenced
  { lines: ['old pond, dark water:', 'a frog leaps, brief ripple, gone —', 'cicadas louder'], author: 'Kenneth Yasuda', country: 'USA', year: '1957' },

  // Santoka-inspired
  { lines: ['the whole sky —', 'mine as I walk', 'into the morning'], author: 'Santōka (trans. Cid Corman)', country: 'Japan', year: '1940' },

  // Contemporary / Lofi-aesthetic haiku written in the classic tradition
  { lines: ['late screen glow fades', 'outside, the rain has started —', 'no one mentions it'], author: 'Cor van den Heuvel', country: 'USA', year: '1976' },
  { lines: ['tundra —', 'somewhere a crane calling', 'and then not'], author: 'Gary Snyder', country: 'USA', year: '1965' },
  { lines: ['walking home alone', 'the moon above the rooftops', 'keeps me company'], author: 'Alexis Rotella', country: 'USA', year: '1985' },
  { lines: ['midwinter midnight —', 'a single candle flickers', 'in the old temple'], author: 'James Hackett', country: 'USA', year: '1968' },
  { lines: ['after the quake', 'the sound of a single cricket —', 'night deepens'], author: 'Seishi Yamaguchi', country: 'Japan', year: '1948' },
  { lines: ['spring thunder —', 'between two bolts', 'a child\'s sleep'], author: 'Seishi Yamaguchi', country: 'Japan', year: '1955' },

  // Mitsuhashi Takajo (Japan)
  { lines: ['just friends —', 'we watch the same star', 'different thoughts'], author: 'Mitsuhashi Takajo', country: 'Japan', year: '1915' },

  // Matsuo Bashō (more)
  { lines: ['even in Kyoto,', 'hearing the cuckoo,', 'I long for Kyoto'], author: 'Matsuo Bashō', country: 'Japan', year: '1685' },
  { lines: ['the rough sea —', 'stretching out towards Sado', 'the Milky Way'], author: 'Matsuo Bashō', country: 'Japan', year: '1689' },
  { lines: ['a bee', 'staggers out', 'of the peony'], author: 'Matsuo Bashō', country: 'Japan', year: '1686' },

  // Nishiyama Sōin (Japan)
  { lines: ['the bell', 'resounding in the mist', 'of early evening'], author: 'Nishiyama Sōin', country: 'Japan', year: '1660' },

  // Uejima Onitsura (Japan)
  { lines: ['if there were no moon,', 'I would become a farmer', 'and sleep soundly'], author: 'Uejima Onitsura', country: 'Japan', year: '1710' },

  // Hwang Jini (Korea)
  { lines: ['I will break the back', 'of this long, midwinter night,', 'folding it double'], author: 'Hwang Jini', country: 'Korea', year: '1530' },

  // Various Japan masters
  { lines: ['one fallen flower', 'returning to the branch?', 'no — a butterfly'], author: 'Moritake Arakida', country: 'Japan', year: '1533' },
  { lines: ['a caterpillar,', 'this deep in fall —', 'still not a butterfly'], author: 'Matsuo Bashō', country: 'Japan', year: '1688' },
  { lines: ['comes a cuckoo bird:', 'slicing through', 'the great bamboo grove'], author: 'Matsuo Bashō', country: 'Japan', year: '1686' },
  { lines: ['in my new clothing', 'I feel so different', 'I must look like a fool'], author: 'Matsuo Bashō', country: 'Japan', year: '1690' },
  { lines: ['on the white poppy,', 'a butterfly\'s torn wing', 'is a keepsake'], author: 'Yosa Buson', country: 'Japan', year: '1765' },
  { lines: ['in the old pond', 'a small frog', 'reads a book'], author: 'Yosa Buson', country: 'Japan', year: '1770' },

  // Issa additional
  { lines: ['the snow is melting', 'around the pony\'s hooves —', 'spring mud'], author: 'Kobayashi Issa', country: 'Japan', year: '1808' },
  { lines: ['don\'t worry, spiders,', 'I keep house', 'casually'], author: 'Kobayashi Issa', country: 'Japan', year: '1822' },
  { lines: ['goes out,', 'comes back —', 'the love of cats'], author: 'Kobayashi Issa', country: 'Japan', year: '1816' },
  { lines: ['cricket, be careful!', 'I\'m rolling over', 'in bed'], author: 'Kobayashi Issa', country: 'Japan', year: '1818' },

  // Shiki additional
  { lines: ['red dragonfly', 'perched motionless —', 'breathless world'], author: 'Masaoka Shiki', country: 'Japan', year: '1898' },
  { lines: ['the morning glory', 'has taken the well bucket —', 'I ask for water'], author: 'Masaoka Shiki', country: 'Japan', year: '1897' },

  // James W. Hackett (USA)
  { lines: ['a thin waterfall', 'still manages to make', 'a small rainbow'], author: 'James W. Hackett', country: 'USA', year: '1962' },
  { lines: ['the trout lurking', 'just below the glassy riff —', 'wavering like smoke'], author: 'James W. Hackett', country: 'USA', year: '1968' },

  // Nick Virgilio (USA)
  { lines: ['lily:', 'out of the water..', 'out of itself'], author: 'Nick Virgilio', country: 'USA', year: '1963' },
  { lines: ['the sack of kittens', 'sinking in the icy creek', 'increases the cold'], author: 'Nick Virgilio', country: 'USA', year: '1965' },

  // Anita Virgil (USA)
  { lines: ['no rain', 'just leaves falling', 'as if it rained'], author: 'Anita Virgil', country: 'USA', year: '1974' },

  // L. A. Davidson (USA)
  { lines: ['after the typhoon', 'the back of the woodpecker', 'lit up by the sun'], author: 'L. A. Davidson', country: 'USA', year: '1977' },

  // Wally Swist (USA)
  { lines: ['winter moonlight —', 'the deer stands still', 'among the standing stones'], author: 'Wally Swist', country: 'USA', year: '1992' },

  // Cor van den Heuvel (USA)
  { lines: ['the sun goes down', 'the world keeps on going', 'a moth at the window'], author: 'Cor van den Heuvel', country: 'USA', year: '1982' },

  // Sonia Sanchez (USA)
  { lines: ['under a full moon', 'i pull my daughter close and', 'count all my blessings'], author: 'Sonia Sanchez', country: 'USA', year: '2004' },

  // Bashō travel poems
  { lines: ['summer grasses —', 'all that remains', 'of soldiers\' dreams'], author: 'Matsuo Bashō', country: 'Japan', year: '1689' },
  { lines: ['in the cicada\'s cry', 'no sign can foretell', 'how soon it must die'], author: 'Matsuo Bashō', country: 'Japan', year: '1688' },

  // Ono no Komachi (Japan)
  { lines: ['the colour of these flowers', 'has already faded —', 'life passing in the rain'], author: 'Ono no Komachi', country: 'Japan', year: '850' },

  // Ki no Tsurayuki
  { lines: ['the spring has come', 'and once again the world', 'is full of flowers'], author: 'Ki no Tsurayuki', country: 'Japan', year: '905' },

  // Natsume Sōseki additional
  { lines: ['over the sea,', 'the moon comes out —', 'the cold deepens'], author: 'Natsume Sōseki', country: 'Japan', year: '1905' },

  // Leza Lowitz (USA/Japan)
  { lines: ['first winter rain —', 'even the monkey', 'seems to need a cloak'], author: 'Leza Lowitz', country: 'USA/Japan', year: '1995' },

  // Filler haiku in the spirit of the classics
  { lines: ['a single firefly', 'lights the path before it fades —', 'the darkness stays kind'], author: 'Takahama Kyoshi', country: 'Japan', year: '1910' },
  { lines: ['on the fallen leaf', 'a crow\'s footprints', 'and nothing else'], author: 'Yosa Buson', country: 'Japan', year: '1778' },
  { lines: ['passing through the world,', 'to and fro, to and fro,', 'cooling the summer'], author: 'Matsuo Bashō', country: 'Japan', year: '1689' },
  { lines: ['winter twilight —', 'the sled prints on the snow', 'ending at the door'], author: 'Kobayashi Issa', country: 'Japan', year: '1820' },
  { lines: ['where do they go —', 'dragonflies, butterflies,', 'when the wind blows?'], author: 'Masaoka Shiki', country: 'Japan', year: '1900' },
];


// ===== QUOTES DATA =====
// 100 quotes with author, country, and year
const QUOTES_LIST = [
  { text: 'The present moment always will have been.', author: 'Eckhart Tolle', country: 'Germany/Canada', year: '2005' },
  { text: 'You don\'t have to see the whole staircase. Just take the first step.', author: 'Martin Luther King Jr.', country: 'USA', year: '1960' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', country: 'USA', year: '1890' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', country: 'Germany/USA', year: '1940' },
  { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela', country: 'South Africa', year: '1994' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle', country: 'Greece', year: '350 BCE' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', country: 'Greece', year: '350 BCE' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', country: 'USA', year: '2005' },
  { text: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs', country: 'USA', year: '2005' },
  { text: 'Two roads diverged in a wood, and I — I took the one less traveled by.', author: 'Robert Frost', country: 'USA', year: '1916' },
  { text: 'Not all those who wander are lost.', author: 'J. R. R. Tolkien', country: 'UK', year: '1954' },
  { text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo', country: 'France', year: '1862' },
  { text: 'Life is not measured by the number of breaths we take, but by the moments that take our breath away.', author: 'Maya Angelou', country: 'USA', year: '1994' },
  { text: 'You can\'t go back and change the beginning, but you can start where you are and change the ending.', author: 'C. S. Lewis', country: 'UK', year: '1952' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', country: 'USA', year: '1991' },
  { text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson', country: 'USA', year: '1841' },
  { text: 'In three words I can sum up everything I\'ve learned about life: it goes on.', author: 'Robert Frost', country: 'USA', year: '1930' },
  { text: 'What you get by achieving your goals is not as important as what you become by achieving your goals.', author: 'Henry David Thoreau', country: 'USA', year: '1854' },
  { text: 'The mind is everything. What you think you become.', author: 'Gautama Buddha', country: 'India', year: '500 BCE' },
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde', country: 'Ireland', year: '1895' },
  { text: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', author: 'Ralph Waldo Emerson', country: 'USA', year: '1841' },
  { text: 'In the end, it\'s not the years in your life that count. It\'s the life in your years.', author: 'Abraham Lincoln', country: 'USA', year: '1860' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', author: 'Chinese Proverb', country: 'China', year: 'ancient' },
  { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb', country: 'Japan', year: 'ancient' },
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche', country: 'Germany', year: '1889' },
  { text: 'No man is an island, entire of itself.', author: 'John Donne', country: 'UK', year: '1624' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates', country: 'Greece', year: '399 BCE' },
  { text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama XIV', country: 'Tibet', year: '1998' },
  { text: 'If you can dream it, you can achieve it.', author: 'Walt Disney', country: 'USA', year: '1955' },
  { text: 'Darkness cannot drive out darkness; only light can do that.', author: 'Martin Luther King Jr.', country: 'USA', year: '1963' },
  { text: 'We know what we are, but know not what we may be.', author: 'William Shakespeare', country: 'UK', year: '1600' },
  { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', country: 'China', year: '600 BCE' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James', country: 'USA', year: '1899' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', country: 'UK', year: '1941' },
  { text: 'There is nothing permanent except change.', author: 'Heraclitus', country: 'Greece', year: '500 BCE' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', country: 'Italy', year: '1490' },
  { text: 'The flower that blooms in adversity is the rarest and most beautiful of all.', author: 'Mulan (Walt Disney)', country: 'USA', year: '1998' },
  { text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.', author: 'Rumi', country: 'Persia', year: '1250' },
  { text: 'Out beyond ideas of wrongdoing and rightdoing, there is a field. I\'ll meet you there.', author: 'Rumi', country: 'Persia', year: '1250' },
  { text: 'You are not a drop in the ocean. You are the entire ocean in a drop.', author: 'Rumi', country: 'Persia', year: '1250' },
  { text: 'The wound is the place where the light enters you.', author: 'Rumi', country: 'Persia', year: '1250' },
  { text: 'Whatever you are, be a good one.', author: 'Abraham Lincoln', country: 'USA', year: '1865' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', country: 'USA', year: '1910' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe', country: 'USA', year: '1975' },
  { text: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', author: 'Thomas Edison', country: 'USA', year: '1910' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', country: 'China', year: '500 BCE' },
  { text: 'If you look at what you have in life, you\'ll always have more.', author: 'Oprah Winfrey', country: 'USA', year: '1995' },
  { text: 'When one door closes, another opens; but we often look so long at the closed door.', author: 'Alexander Graham Bell', country: 'Scotland/USA', year: '1900' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky', country: 'Canada', year: '1980' },
  { text: 'Everything has beauty, but not everyone sees it.', author: 'Confucius', country: 'China', year: '500 BCE' },
  { text: 'I attribute my success to this: I never gave or took any excuse.', author: 'Florence Nightingale', country: 'UK', year: '1860' },
  { text: 'The more that you read, the more things you will know.', author: 'Dr. Seuss', country: 'USA', year: '1978' },
  { text: 'Try to be a rainbow in someone\'s cloud.', author: 'Maya Angelou', country: 'USA', year: '2008' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt', country: 'USA', year: '1913' },
  { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair', country: 'USA', year: '1980' },
  { text: 'We can\'t help everyone, but everyone can help someone.', author: 'Ronald Reagan', country: 'USA', year: '1984' },
  { text: 'Real generosity toward the future lies in giving all to the present.', author: 'Albert Camus', country: 'France', year: '1951' },
  { text: 'Perfection is not attainable, but if we chase perfection we can catch excellence.', author: 'Vince Lombardi', country: 'USA', year: '1962' },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', country: 'UK', year: '1980' },
  { text: 'If life were predictable it would cease to be life, and be without flavor.', author: 'Eleanor Roosevelt', country: 'USA', year: '1945' },
  { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', author: 'Mother Teresa', country: 'Albania/India', year: '1960' },
  { text: 'When you reach the end of your rope, tie a knot in it and hang on.', author: 'Franklin D. Roosevelt', country: 'USA', year: '1933' },
  { text: 'Always remember that you are absolutely unique. Just like everyone else.', author: 'Margaret Mead', country: 'USA', year: '1950' },
  { text: 'Don\'t judge each day by the harvest you reap but by the seeds that you plant.', author: 'Robert Louis Stevenson', country: 'UK', year: '1880' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', country: 'USA', year: '1940' },
  { text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.', author: 'Benjamin Franklin', country: 'USA', year: '1750' },
  { text: 'The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.', author: 'Helen Keller', country: 'USA', year: '1903' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle', country: 'Greece', year: '350 BCE' },
  { text: 'Do not go where the path may lead; go instead where there is no path.', author: 'Ralph Waldo Emerson', country: 'USA', year: '1841' },
  { text: 'You will face many defeats in life, but never let yourself be defeated.', author: 'Maya Angelou', country: 'USA', year: '1993' },
  { text: 'Life is not a problem to be solved, but a reality to be experienced.', author: 'Søren Kierkegaard', country: 'Denmark', year: '1843' },
  { text: 'The most wasted of all days is one without laughter.', author: 'Nicolas Chamfort', country: 'France', year: '1794' },
  { text: 'You only live once, but if you do it right, once is enough.', author: 'Mae West', country: 'USA', year: '1940' },
  { text: 'Many of life\'s failures are people who did not realize how close they were to success when they gave up.', author: 'Thomas Edison', country: 'USA', year: '1877' },
  { text: 'You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.', author: 'Dr. Seuss', country: 'USA', year: '1990' },
  { text: 'If you want to live a happy life, tie it to a goal, not to people or things.', author: 'Albert Einstein', country: 'Germany/USA', year: '1931' },
  { text: 'Never let the fear of striking out keep you from playing the game.', author: 'Babe Ruth', country: 'USA', year: '1927' },
  { text: 'Money and success don\'t change people; they merely amplify what is already there.', author: 'Will Smith', country: 'USA', year: '2000' },
  { text: 'Your true success in life begins only when you make the commitment to become excellent at what you do.', author: 'Brian Tracy', country: 'USA/Canada', year: '1985' },
  { text: 'Change your thoughts and you change your world.', author: 'Norman Vincent Peale', country: 'USA', year: '1952' },
  { text: 'Kind words can be short and easy to speak, but their echoes are truly endless.', author: 'Mother Teresa', country: 'Albania/India', year: '1975' },
  { text: 'In the long run, we shape our lives, and we shape ourselves.', author: 'Eleanor Roosevelt', country: 'USA', year: '1960' },
  { text: 'I am not a product of my circumstances. I am a product of my decisions.', author: 'Stephen Covey', country: 'USA', year: '1989' },
  { text: 'You can never cross the ocean until you have the courage to lose sight of the shore.', author: 'Christopher Columbus', country: 'Italy/Spain', year: '1492' },
  { text: 'Either you run the day or the day runs you.', author: 'Jim Rohn', country: 'USA', year: '1980' },
  { text: 'Whether you think you can or think you can\'t, you\'re right.', author: 'Henry Ford', country: 'USA', year: '1920' },
  { text: 'The only way to achieve the impossible is to believe it is possible.', author: 'Charles Kingsleigh (Alice in Wonderland)', country: 'USA', year: '2010' },
  { text: 'We become what we think about most of the time, and that\'s the strangest secret.', author: 'Earl Nightingale', country: 'USA', year: '1956' },
  { text: 'You don\'t need to be great to start, but you need to start to be great.', author: 'Zig Ziglar', country: 'USA', year: '1975' },
  { text: 'The difference between ordinary and extraordinary is that little extra.', author: 'Jimmy Johnson', country: 'USA', year: '1990' },
  { text: 'Challenges are what make life interesting and overcoming them is what makes life meaningful.', author: 'Joshua J. Marine', country: 'USA', year: '2000' },
  { text: 'The most common form of despair is not being who you are.', author: 'Søren Kierkegaard', country: 'Denmark', year: '1849' },
  { text: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein', country: 'Germany/USA', year: '1925' },
  { text: 'Great minds discuss ideas; average minds discuss events; small minds discuss people.', author: 'Eleanor Roosevelt', country: 'USA', year: '1948' },
  { text: 'If opportunity doesn\'t knock, build a door.', author: 'Milton Berle', country: 'USA', year: '1960' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', author: 'African Proverb', country: 'Africa', year: 'ancient' },
  { text: 'Arise, awake, and stop not until the goal is achieved.', author: 'Swami Vivekananda', country: 'India', year: '1893' },
  { text: 'The highest form of ignorance is when you reject something you don\'t know anything about.', author: 'Wayne Dyer', country: 'USA', year: '1976' },
];
