/*
  Whole soundtracks / albums to import (about 2 Spotify requests per album instead of one per song).
  ## hi :  Movie | Year | optional default genre codes
  ## en :  Album | Artist | Year | default genre codes
  Genre codes: R Romantic, P Party & Dance, S Sad, U Sufi & Soulful, H Hip-Hop & Rap, K Rock,
  O Pop, J Punjabi, M Motivational, C Chill & Indie, N R&B. Songs are also auto-tagged from lyrics.
*/
window.ALBUMS = `
## hi
Pyaasa|1957
Naya Daur|1957
Chalti Ka Naam Gaadi|1958
Madhumati|1958
Howrah Bridge|1958
Kaagaz Ke Phool|1959
Mughal-E-Azam|1960
Barsaat Ki Raat|1960|U
Chaudhvin Ka Chand|1960
Dil Apna Aur Preet Parai|1960
Jis Desh Men Ganga Behti Hai|1960
Junglee|1961
Hum Dono|1961
Gunga Jumna|1961
Sahib Bibi Aur Ghulam|1962
Bees Saal Baad|1962
Professor|1962
Taj Mahal|1963
Mere Mehboob|1963
Bandini|1963
Dosti|1964
Kashmir Ki Kali|1964
Woh Kaun Thi|1964
Sangam|1964
Haqeeqat|1964
Guide|1965
Waqt|1965
Jab Jab Phool Khile|1965
Teesri Manzil|1966
Suraj|1966
Mera Saaya|1966
Upkar|1967
An Evening in Paris|1967
Milan|1967
Padosan|1968
Brahmachari|1968
Neel Kamal|1968
Aradhana|1969
Do Raaste|1969
Johny Mera Naam|1970
Kati Patang|1970
Mera Naam Joker|1970
Safar|1970
Purab Aur Paschim|1970
Sachaa Jhutha|1970
Anand|1971
Amar Prem|1972
Hare Rama Hare Krishna|1971
Caravan|1971
Pakeezah|1972
Seeta Aur Geeta|1972
Parichay|1972
Apna Desh|1972
Bombay to Goa|1972
Bobby|1973
Yaadon Ki Baaraat|1973
Zanjeer|1973
Abhimaan|1973
Namak Haraam|1973
Daag|1973
Aap Ki Kasam|1974
Roti Kapda Aur Makaan|1974
Prem Nagar|1974
Ajanabee|1974
Sholay|1975
Deewaar|1975
Aandhi|1975
Julie|1975
Chupke Chupke|1975
Khushboo|1975
Kabhi Kabhie|1976
Chalte Chalte|1976
Mehbooba|1976
Amar Akbar Anthony|1977
Hum Kisise Kum Naheen|1977
Dharam Veer|1977
Don|1978
Muqaddar Ka Sikandar|1978
Satyam Shivam Sundaram|1978
Trishul|1978
Ghar|1978
Gol Maal|1979
Mr. Natwarlal|1979
Noorie|1979
Sargam|1979
Karz|1980
Qurbani|1980
Shaan|1980
Dostana|1980
Silsila|1981
Umrao Jaan|1981|U
Ek Duuje Ke Liye|1981
Love Story|1981
Naseeb|1981
Kudrat|1981
Rocky|1981
Laawaris|1981
Namak Halaal|1982
Disco Dancer|1982|P
Satte Pe Satta|1982
Prem Rog|1982
Arth|1982|U
Hero|1983
Masoom|1983
Coolie|1983
Betaab|1983
Souten|1983
Sharaabi|1984
Utsav|1984
Saagar|1985
Ram Teri Ganga Maili|1985
Mard|1985
Naam|1986
Karma|1986
Mr. India|1987
Ijaazat|1987
Qayamat Se Qayamat Tak|1988
Tezaab|1988
Shahenshah|1988
Maine Pyar Kiya|1989
Chandni|1989
Ram Lakhan|1989
Tridev|1989
Parinda|1989
ChaalBaaz|1989
Aashiqui|1990|R
Dil|1990
Ghayal|1990
Thanedaar|1990
Agneepath|1990
Baaghi|1990
Jurm|1990
Saajan|1991|R
Lamhe|1991
Hum|1991
Dil Hai Ki Manta Nahin|1991
Phool Aur Kaante|1991
Sadak|1991
Saudagar|1991
Deewana|1992
Beta|1992
Jo Jeeta Wohi Sikandar|1992
Roja|1992
Khiladi|1992
Bol Radha Bol|1992
Raju Ban Gaya Gentleman|1992
Baazigar|1993
Darr|1993
Khal Nayak|1993
Aankhen|1993
Hum Hain Rahi Pyar Ke|1993
Damini|1993
Hum Aapke Hain Koun|1994
1942: A Love Story|1994
Mohra|1994
Main Khiladi Tu Anari|1994
Dilwale|1994
Krantiveer|1994
Yeh Dillagi|1994
Laadla|1994
Raja Babu|1994
Andaz Apna Apna|1994
Kabhi Haan Kabhi Naa|1994
Dilwale Dulhania Le Jayenge|1995|R
Rangeela|1995
Karan Arjun|1995
Bombay|1995
Raja|1995
Coolie No. 1|1995
Barsaat|1995
Akele Hum Akele Tum|1995
Ram Jaane|1995
Raja Hindustani|1996
Agni Sakshi|1996
Khamoshi: The Musical|1996
Jeet|1996
Saajan Chale Sasural|1996
Papa Kehte Hain|1996
Diljale|1996
Ghatak|1996
Dil To Pagal Hai|1997|R
Pardes|1997
Border|1997|M
Yes Boss|1997
Ishq|1997
Judaai|1997
Hero No. 1|1997
Virasat|1997
Mr. and Mrs. Khiladi|1997
Gupt|1997
Kuch Kuch Hota Hai|1998|R
Dil Se..|1998
Satya|1998
Pyaar To Hona Hi Tha|1998
Soldier|1998
Dulhe Raja|1998
Bade Miyan Chote Miyan|1998
Ghulam|1998
Jab Pyaar Kisise Hota Hai|1998
Pyaar Kiya To Darna Kya|1998
Duplicate|1998
Kareeb|1998
Hum Dil De Chuke Sanam|1999
Taal|1999
Hum Saath-Saath Hain|1999
Biwi No.1|1999
Sarfarosh|1999
Mann|1999
Dillagi|1999
Haseena Maan Jaayegi|1999
Baadshah|1999
Arjun Pandit|1999
Hum Aapke Dil Mein Rehte Hain|1999
Jaanam Samjha Karo|1999
Aarzoo|1999
Kaho Naa... Pyaar Hai|2000
Mohabbatein|2000
Dhadkan|2000
Refugee|2000
Josh|2000
Kya Kehna|2000
Fiza|2000
Hamara Dil Aapke Paas Hai|2000
Har Dil Jo Pyar Karega|2000
Hera Pheri|2000
Mission Kashmir|2000
Pukar|2000
Dil Chahta Hai|2001
Kabhi Khushi Kabhie Gham|2001
Lagaan|2001
Gadar: Ek Prem Katha|2001
Rehnaa Hai Terre Dil Mein|2001|R
Ajnabee|2001
Yaadein|2001
Mujhe Kucch Kehna Hai|2001
Asoka|2001
Chori Chori Chupke Chupke|2001
Zubeidaa|2001
Tum Bin|2001|R
Devdas|2002
Saathiya|2002
Humraaz|2002
Raaz|2002
Mere Yaar Ki Shaadi Hai|2002
Aankhen|2002
Kaante|2002
Dil Hai Tumhaara|2002
Na Tum Jaano Na Hum|2002
Deewangee|2002
Awara Paagal Deewana|2002
Hum Tumhare Hain Sanam|2002
Company|2002
Kal Ho Naa Ho|2003
Koi... Mil Gaya|2003
Chalte Chalte|2003
Tere Naam|2003
Baghban|2003
Munna Bhai M.B.B.S.|2003
Jism|2003
Ishq Vishk|2003
Main Prem Ki Diwani Hoon|2003
Kuch Naa Kaho|2003
Saaya|2003
Andaaz|2003
LOC Kargil|2003|M
Main Hoon Na|2004
Veer-Zaara|2004
Dhoom|2004|P
Swades|2004
Hum Tum|2004
Murder|2004
Mujhse Shaadi Karogi|2004
Masti|2004
Fida|2004
Aitraaz|2004
Yuva|2004
Khakee|2004
Paap|2004
Tumsa Nahin Dekha|2004
Bunty Aur Babli|2005
Salaam Namaste|2005
Zeher|2005
Kalyug|2005
Aashiq Banaya Aapne|2005
No Entry|2005
Parineeta|2005
Garam Masala|2005
Kyaa Kool Hai Hum|2005
Dus|2005
Bluffmaster!|2005
Lucky: No Time for Love|2005
Waqt: The Race Against Time|2005
Rang De Basanti|2006
Dhoom 2|2006|P
Fanaa|2006
Krrish|2006
Kabhi Alvida Naa Kehna|2006
Gangster|2006
Omkara|2006
Lage Raho Munna Bhai|2006
Don|2006
Phir Hera Pheri|2006
Woh Lamhe|2006
Aksar|2006
Vivah|2006
Pyaar Ke Side Effects|2006
Om Shanti Om|2007
Jab We Met|2007
Chak De! India|2007|M
Taare Zameen Par|2007
Saawariya|2007
Guru|2007
Bhool Bhulaiyaa|2007
Partner|2007
Namastey London|2007
Life in a... Metro|2007
Welcome|2007
Jhoom Barabar Jhoom|2007
Aaja Nachle|2007
Ta Ra Rum Pum|2007
Heyy Babyy|2007
Race|2008
Jodhaa Akbar|2008
Rab Ne Bana Di Jodi|2008
Ghajini|2008
Jaane Tu... Ya Jaane Na|2008
Rock On!!|2008|K
Singh Is Kinng|2008
Dostana|2008
Bachna Ae Haseeno|2008
Jannat|2008
Fashion|2008
Kismat Konnection|2008
Love Aaj Kal|2009
3 Idiots|2009
Delhi-6|2009
Ajab Prem Ki Ghazab Kahani|2009
Wake Up Sid|2009
Kaminey|2009
Dev.D|2009
New York|2009
Raaz - The Mystery Continues|2009
Wanted|2009
Tum Mile|2009
Blue|2009
All the Best|2009
Kurbaan|2009
De Dana Dan|2009
Paa|2009
My Name Is Khan|2010
Dabangg|2010
Band Baaja Baaraat|2010
I Hate Luv Storys|2010
Once Upon a Time in Mumbaai|2010
Tees Maar Khan|2010
Anjaana Anjaani|2010
Raajneeti|2010
Golmaal 3|2010
Housefull|2010
Aisha|2010
Break Ke Baad|2010
Crook|2010
Rockstar|2011
Zindagi Na Milegi Dobara|2011
Ra.One|2011
Bodyguard|2011
Ready|2011
The Dirty Picture|2011
Murder 2|2011
Singham|2011
Delhi Belly|2011
Mausam|2011
Tanu Weds Manu|2011
Mere Brother Ki Dulhan|2011
Desi Boyz|2011
Agneepath|2012
Barfi!|2012
Jab Tak Hai Jaan|2012
Cocktail|2012
Student of the Year|2012
Ek Tha Tiger|2012
Dabangg 2|2012
Agent Vinod|2012
Jannat 2|2012
Vicky Donor|2012
Rowdy Rathore|2012
Gangs of Wasseypur|2012
Raaz 3|2012
Son of Sardaar|2012
Talaash|2012
Ishaqzaade|2012
Shanghai|2012
Aashiqui 2|2013|R
Yeh Jawaani Hai Deewani|2013
Goliyon Ki Raasleela Ram-Leela|2013
Chennai Express|2013
Bhaag Milkha Bhaag|2013
Raanjhanaa|2013
Krrish 3|2013
Dhoom 3|2013
Murder 3|2013
Race 2|2013
Kai Po Che!|2013
Lootera|2013
Grand Masti|2013
R... Rajkumar|2013
Ramaiya Vastavaiya|2013
Fukrey|2013
Gori Tere Pyaar Mein|2013
Phata Poster Nikhla Hero|2013
Shuddh Desi Romance|2013
Highway|2014
Queen|2014
2 States|2014
Ek Villain|2014
Humpty Sharma Ki Dulhania|2014
Happy New Year|2014
Kick|2014
Gunday|2014
Hasee Toh Phasee|2014
Main Tera Hero|2014
CityLights|2014
Khoobsurat|2014
Bang Bang!|2014
Haider|2014
PK|2014
Yaariyan|2014
Holiday|2014
Heropanti|2014
Singham Returns|2014
Hate Story 2|2014
Bajrangi Bhaijaan|2015
Bajirao Mastani|2015
Dilwale|2015
Tamasha|2015
Prem Ratan Dhan Payo|2015
Roy|2015
Hamari Adhuri Kahani|2015
ABCD 2|2015
Dil Dhadakne Do|2015
Badlapur|2015
Khamoshiyan|2015
Hero|2015
Brothers|2015
Tanu Weds Manu Returns|2015
Piku|2015
Dum Laga Ke Haisha|2015
Masaan|2015
Welcome Back|2015
Singh Is Bliing|2015
Pyaar Ka Punchnama 2|2015
Hate Story 3|2015
Ae Dil Hai Mushkil|2016
Sultan|2016
Dangal|2016
M.S. Dhoni: The Untold Story|2016
Kapoor & Sons|2016
Baar Baar Dekho|2016
Befikre|2016
Sanam Re|2016
Sanam Teri Kasam|2016
Airlift|2016
Fitoor|2016
Rustom|2016
Azhar|2016
Do Lafzon Ki Kahani|2016
Udta Punjab|2016
Housefull 3|2016
Dishoom|2016
Mirzya|2016
Ki & Ka|2016
Shivaay|2016
Raees|2017
Tiger Zinda Hai|2017
Half Girlfriend|2017
Jab Harry Met Sejal|2017
Badrinath Ki Dulhania|2017
OK Jaanu|2017
Raabta|2017
Bareilly Ki Barfi|2017
Jagga Jasoos|2017
Judwaa 2|2017
Golmaal Again|2017
Hindi Medium|2017
Tumhari Sulu|2017
Baadshaho|2017
Toilet - Ek Prem Katha|2017
Shubh Mangal Saavdhan|2017
Mubarakan|2017
Padmaavat|2018
Simmba|2018
Sonu Ke Titu Ki Sweety|2018
Stree|2018
Sanju|2018
Kedarnath|2018
Zero|2018
Raazi|2018
Badhaai Ho|2018
Veere Di Wedding|2018
Satyameva Jayate|2018
Loveyatri|2018
Dhadak|2018
Andhadhun|2018
Raid|2018
Pad Man|2018
Race 3|2018
Baaghi 2|2018
Namaste England|2018
Genius|2018
Batti Gul Meter Chalu|2018
Manmarziyaan|2018
Kabir Singh|2019
War|2019
Gully Boy|2019|H
Kalank|2019
Kesari|2019
Chhichhore|2019
Luka Chuppi|2019
Bharat|2019
Marjaavaan|2019
Pati Patni Aur Woh|2019
Dream Girl|2019
Total Dhamaal|2019
Student Of The Year 2|2019
Batla House|2019
Good Newwz|2019
Housefull 4|2019
Uri - The Surgical Strike|2019
Saaho|2019
Dabangg 3|2019
Super 30|2019
Bala|2019
De De Pyaar De|2019
Jabariya Jodi|2019
Why Cheat India|2019
Love Aaj Kal|2020
Malang|2020
Street Dancer 3D|2020|P
Tanhaji|2020
Shubh Mangal Zyada Saavdhan|2020
Baaghi 3|2020
Angrezi Medium|2020
Dil Bechara|2020
Ludo|2020
Coolie No.1|2020
Shershaah|2021
Atrangi Re|2021
Sooryavanshi|2021
83|2021
Mimi|2021
Tadap|2021
Chandigarh Kare Aashiqui|2021
Bell Bottom|2021
Haseen Dillruba|2021
Pushpa - The Rise (Hindi)|2021
Brahmastra|2022
Bhool Bhulaiyaa 2|2022
Gangubai Kathiawadi|2022
Laal Singh Chaddha|2022
Jugjugg Jeeyo|2022
Bhediya|2022
Drishyam 2|2022
Vikram Vedha|2022
Bachchhan Paandey|2022
Raksha Bandhan|2022
Ek Villain Returns|2022
An Action Hero|2022
Pathaan|2023
Jawan|2023
Animal|2023
Rocky Aur Rani Kii Prem Kahaani|2023
Tu Jhoothi Main Makkaar|2023
Dunki|2023
Zara Hatke Zara Bachke|2023
Satyaprem Ki Katha|2023
Gadar 2|2023
Tiger 3|2023
Dream Girl 2|2023
12th Fail|2023
OMG 2|2023
Bawaal|2023
Shehzada|2023
Kisi Ka Bhai Kisi Ki Jaan|2023
Fighter|2024
Teri Baaton Mein Aisa Uljha Jiya|2024
Crew|2024
Stree 2|2024
Bad Newz|2024
Bhool Bhulaiyaa 3|2024
Singham Again|2024
Laapataa Ladies|2024
Mr. & Mrs. Mahi|2024
Do Aur Do Pyaar|2024
Amar Singh Chamkila|2024
Pushpa 2 - The Rule (Hindi)|2024
Vicky Vidya Ka Woh Wala Video|2024
Bade Miyan Chote Miyan|2024
Munjya|2024
Yodha|2024
Shaitaan|2024
Saiyaara|2025
Chhaava|2025
Sky Force|2025
Loveyapa|2025
Sikandar|2025
Raid 2|2025
Housefull 5|2025
Metro... In Dino|2025
Sitaare Zameen Par|2025
Son of Sardaar 2|2025
Param Sundari|2025
War 2|2025
Dhadak 2|2025
Thamma|2025
Ek Deewane Ki Deewaniyat|2025
Bhool Chuk Maaf|2025
Moosetape|2021|J H
PBX 1|2018|J
Hidden Gems|2021|J
Two Hearts Never Break The Same|2022|J
MoonChild Era|2021|J
G.O.A.T.|2020|J
Ghost|2023|J
Making Memories|2023|J
Four You|2023|J
Champagne Talk|2022|H
Desi Kalakaar|2014|P H
International Villager|2011|P J
Glory|2024|P H
Kohinoor|2019|H
Punya Paap|2020|H
Aalas Ka Pedh|2015|K C
Vaaqif|2018|K C
In Tokens & Charms|2016|C
Barsaat|1949
Awaara|1951
Baiju Bawra|1952
Shree 420|1955
Nagin|1954
C.I.D.|1956
Chori Chori|1956
Tumsa Nahin Dekha|1957
Phagun|1958
Anari|1959
Navrang|1959
Kala Bazar|1960
Kohinoor|1960
Asli-Naqli|1962
Dil Ek Mandir|1963
Phir Wohi Dil Laya Hoon|1963
Ayee Milan Ki Bela|1964
Leader|1964
Arzoo|1965
Himalay Ki God Mein|1965
Shaheed|1965
Pyar Kiye Jaa|1966
Love in Tokyo|1966
Teesri Kasam|1966
Jewel Thief|1967
Hamraaz|1967
Aamne Samne|1967
Shagird|1967
Ankhen|1968
Kismat|1968
Jeene Ki Raah|1969
Aya Sawan Jhoom Ke|1969
Pyar Hi Pyar|1969
Khamoshi|1969
Prince|1969
Jeevan Mrityu|1970
Abhinetri|1970
The Train|1970
Humjoli|1970
Pagla Kahin Ka|1970
Buddha Mil Gaya|1971
Andaz|1971
Lal Patthar|1971
Mehboob Ki Mehndi|1971
Dushmun|1971
Haathi Mere Saathi|1971
Mere Jeevan Saathi|1972
Shor|1972
Raja Jani|1972
Victoria No. 203|1972
Jawani Diwani|1972
Blackmail|1973
Hindustan Ki Kasam|1973
Loafer|1973
Jheel Ke Us Paar|1973
Anamika|1973
Kora Kagaz|1974
Mili|1975
Dharmatma|1975
Sanyasi|1975
Khel Khel Mein|1975
Rafoo Chakkar|1975
Mausam|1975
Laila Majnu|1976
Hera Pheri|1976
Charas|1976
Kalicharan|1976
Kasme Vaade|1978
Shalimar|1978
Pati Patni Aur Woh|1978
Suhaag|1979
Kaala Patthar|1979
Jurmana|1979
Baton Baton Mein|1979
Khubsoorat|1980
Abdullah|1980
Aasha|1980
Ram Balram|1980
Thodisi Bewafaii|1980
Kaalia|1981
Yeh Vaada Raha|1982
Bemisal|1982
Desh Premee|1982
Mahaan|1983
Andha Kanoon|1983
Avtaar|1983
Mawaali|1983
Himmatwala|1983
Tohfa|1984
Pyar Jhukta Nahin|1985
Janbaaz|1986
Aakhree Raasta|1986
Nagina|1986
Jalwa|1987
Dance Dance|1987
Khoon Bhari Maang|1988
Dayavan|1988
Waaris|1988
Ilaaka|1989
Kishen Kanhaiya|1990
Swarg|1990
Awaargi|1990
Sanam Bewafa|1991
Saathi|1991
Henna|1991
Prem Qaidi|1991
Jigar|1992
Junoon|1992
Shola Aur Shabnam|1992
Dil Ka Kya Kasoor|1992
Anari|1993
Gumrah|1993
Dil Tera Aashiq|1993
Rang|1993
Waqt Hamara Hai|1993
Aaina|1993
Vijaypath|1994
Suhaag|1994
Imtihan|1994
Eena Meena Deeka|1994
Anjaam|1994
Gopi Kishan|1994
Yaraana|1995
Sabse Bada Khiladi|1995
Baazi|1995
Khiladiyon Ka Khiladi|1996
Daraar|1996
Masoom|1996
Rakshak|1996
Prem Granth|1996
Chaahat|1996
Deewana Mastana|1997
Auzaar|1997
Ziddi|1997
Daud|1997
Koyla|1997
Mohabbat|1997
Chachi 420|1997
Major Saab|1998
Bandhan|1998
Dushman|1998
Kachche Dhaage|1999
Mast|1999
Jaanwar|1999
Khoobsurat|1999
Anari No.1|1999
Dhaai Akshar Prem Ke|2000
Badal|2000
Bichhoo|2000
Jodi No.1|2001
Nayak|2001
Ek Rishtaa|2001
Hum Kisi Se Kum Nahin|2002
Kyaa Dil Ne Kahaa|2002
Mujhse Dosti Karoge!|2002
Dil Vil Pyar Vyar|2002
Armaan|2003
Qayamat|2003
Khushi|2003
Jhankaar Beats|2003
Hungama|2003
Kyun! Ho Gaya Na...|2004
Hulchul|2004
Dil Ne Jise Apna Kaha|2004
Musafir|2004
Bewafaa|2005
Maine Pyaar Kyun Kiya|2005
Kisna|2005
Mangal Pandey|2005
Neal 'n' Nikki|2005
Apna Sapna Money Money|2006
Golmaal|2006
Bhagam Bhag|2006
Humko Deewana Kar Gaye|2006
Aryan|2006
Chup Chup Ke|2006
Shakalaka Boom Boom|2007
Cash|2007
Dhol|2007
Awarapan|2007
Laaga Chunari Mein Daag|2007
Khoya Khoya Chand|2007
Salaam-e-Ishq|2007
Tashan|2008
Golmaal Returns|2008
Krazzy 4|2008
Yuvvraaj|2008
Ugly Aur Pagli|2008
Karzzzz|2008
Kambakkht Ishq|2009
Aladin|2009
Life Partner|2009
Jashnn|2009
What's Your Raashee?|2009
Chandni Chowk To China|2009
London Dreams|2009
Veer|2010
Prince|2010
Kites|2010
Khatta Meetha|2010
Action Replayy|2010
Lafangey Parindey|2010
Badmaash Company|2010
Patiala House|2011
Thank You|2011
Double Dhamaal|2011
Always Kabhi Kabhi|2011
Bbuddah Hoga Terra Baap|2011
Ladies vs Ricky Bahl|2011
Players|2012
Ek Main Aur Ekk Tu|2012
Housefull 2|2012
Teri Meri Kahaani|2012
Bol Bachchan|2012
OMG Oh My God|2012
Khiladi 786|2012
English Vinglish|2012
Kya Super Kool Hain Hum|2012
Table No. 21|2013
Special 26|2013
Himmatwala|2013
Nautanki Saala|2013
Boss|2013
Besharam|2013
Bullett Raja|2013
Jackpot|2013
Satyagraha|2013
Dedh Ishqiya|2014
Jai Ho|2014
Ragini MMS 2|2014
Kill Dil|2014
Daawat-e-Ishq|2014
Lekar Hum Deewana Dil|2014
Action Jackson|2014
Mary Kom|2014
Zid|2014
Creature|2014
Shamitabh|2015
Gabbar Is Back|2015
Bombay Velvet|2015
Shaandaar|2015
All Is Well|2015
Katti Batti|2015
Wazir|2016
Baaghi|2016
A Flying Jatt|2016
Banjo|2016
Tum Bin 2|2016
Dear Zindagi|2016
Kaabil|2017
Jolly LLB 2|2017
Meri Pyaari Bindu|2017
Behen Hogi Teri|2017
Qarib Qarib Singlle|2017
Fukrey Returns|2017
Blackmail|2018
Nawabzaade|2018
Parmanu|2018
Fanney Khan|2018
Sui Dhaaga|2018
Mitron|2018
Thugs Of Hindostan|2018
Notebook|2019
Arjun Patiala|2019
Khandaani Shafakhana|2019
Mission Mangal|2019
Made In China|2019
Pagalpanti|2019
Panipat|2019
Jawaani Jaaneman|2020
Gunjan Saxena|2020
Khaali Peeli|2020
Laxmii|2020
Indoo Ki Jawani|2020
Suraj Pe Mangal Bhari|2020
Roohi|2021
Radhe|2021
Hum Do Hamare Do|2021
Antim|2021
Satyameva Jayate 2|2021
Shiddat|2021
Bunty Aur Babli 2|2021
Badhaai Do|2022
Heropanti 2|2022
Shamshera|2022
Govinda Naam Mera|2022
Cirkus|2022
Thank God|2022
Selfiee|2023
Bholaa|2023
Adipurush|2023
Fukrey 3|2023
Sam Bahadur|2023
Mere Husband Ki Biwi|2025
Kesari Chapter 2|2025
Jaat|2025
Baaghi 4|2025
Jolly LLB 3|2025

## en
Thriller|Michael Jackson|1982|P
Bad|Michael Jackson|1987|P
Dangerous|Michael Jackson|1991|P
Off the Wall|Michael Jackson|1979|P
Number Ones|Michael Jackson|2003|P
Greatest Hits|Queen|1981|K
Greatest Hits II|Queen|1991|K
A Night At The Opera|Queen|1975|K
1|The Beatles|2000|K
Abbey Road|The Beatles|1969|K
Sgt. Pepper's Lonely Hearts Club Band|The Beatles|1967|K
Gold: Greatest Hits|ABBA|1992|P
More ABBA Gold|ABBA|1993|P
Legend|Bob Marley & The Wailers|1984|C
Rumours|Fleetwood Mac|1977|K
Hotel California|Eagles|1976|K
Their Greatest Hits (1971-1975)|Eagles|1976|K
The Dark Side of the Moon|Pink Floyd|1973|K
The Wall|Pink Floyd|1979|K
Wish You Were Here|Pink Floyd|1975|K
Led Zeppelin IV|Led Zeppelin|1971|K
Back In Black|AC/DC|1980|K
Highway to Hell|AC/DC|1979|K
Appetite For Destruction|Guns N' Roses|1987|K
Greatest Hits|Guns N' Roses|2004|K
Slippery When Wet|Bon Jovi|1986|K
Cross Road|Bon Jovi|1994|K
Born In The U.S.A.|Bruce Springsteen|1984|K
Purple Rain|Prince|1984|O
The Immaculate Collection|Madonna|1990|O
Celebration|Madonna|2009|O
Whitney: The Greatest Hits|Whitney Houston|2000|O
The Bodyguard|Whitney Houston|1992|R
Let's Talk About Love|Celine Dion|1997|R
Falling Into You|Celine Dion|1996|R
Faith|George Michael|1987|O
Ladies & Gentlemen: The Best of George Michael|George Michael|1998|O
Saturday Night Fever|Bee Gees|1977|P
Number Ones|Bee Gees|2004|P
Diamonds|Elton John|2017|O
Elvis 30 #1 Hits|Elvis Presley|2002|K
Songs In The Key Of Life|Stevie Wonder|1976|N
Hunting High and Low|a-ha|1985|O
Toto IV|TOTO|1982|K
Escape|Journey|1981|K
Greatest Hits|Journey|1988|K
Reckless|Bryan Adams|1984|K
So Far So Good|Bryan Adams|1993|K
Synchronicity|The Police|1983|K
Brothers In Arms|Dire Straits|1985|K
The Joshua Tree|U2|1987|K
The Best Of 1980-1990|U2|1998|K
Nevermind|Nirvana|1991|K
(What's The Story) Morning Glory?|Oasis|1995|K
Definitely Maybe|Oasis|1994|K
Pablo Honey|Radiohead|1993|K
OK Computer|Radiohead|1997|K
No Need To Argue|The Cranberries|1994|K
Out Of Time|R.E.M.|1991|K
Dookie|Green Day|1994|K
American Idiot|Green Day|2004|K
Hybrid Theory|Linkin Park|2000|K
Meteora|Linkin Park|2003|K
Minutes To Midnight|Linkin Park|2007|K
Papercuts|Linkin Park|2024|K
Californication|Red Hot Chili Peppers|1999|K
By the Way|Red Hot Chili Peppers|2002|K
Toxicity|System Of A Down|2001|K
Fallen|Evanescence|2003|K
Hot Fuss|The Killers|2004|K
Elephant|The White Stripes|2003|K
AM|Arctic Monkeys|2013|K
Favourite Worst Nightmare|Arctic Monkeys|2007|K
Parachutes|Coldplay|2000|K
A Rush of Blood to the Head|Coldplay|2002|K
X&Y|Coldplay|2005|K
Viva La Vida or Death and All His Friends|Coldplay|2008|K
Mylo Xyloto|Coldplay|2011|K
Ghost Stories|Coldplay|2014|O
A Head Full of Dreams|Coldplay|2015|O
Music Of The Spheres|Coldplay|2021|O
Night Visions|Imagine Dragons|2012|K
Smoke + Mirrors|Imagine Dragons|2015|K
Evolve|Imagine Dragons|2017|K
Origins|Imagine Dragons|2018|K
Mercury - Acts 1 & 2|Imagine Dragons|2022|K
Dreaming Out Loud|OneRepublic|2007|O
Native|OneRepublic|2013|O
Human|OneRepublic|2021|O
Songs About Jane|Maroon 5|2002|O
It Won't Be Soon Before Long|Maroon 5|2007|O
Hands All Over|Maroon 5|2010|O
Overexposed|Maroon 5|2012|O
V|Maroon 5|2014|O
Red Pill Blues|Maroon 5|2017|O
Vessel|Twenty One Pilots|2013|K
Blurryface|Twenty One Pilots|2015|K
Trench|Twenty One Pilots|2018|K
Bad Blood|Bastille|2013|K
Hozier|Hozier|2014|K
Unreal Unearth|Hozier|2023|K
Making Mirrors|Gotye|2011|O
Torches|Foster The People|2011|K
Pure Heroine|Lorde|2013|O
Melodrama|Lorde|2017|O
...Baby One More Time|Britney Spears|1999|O
Oops!... I Did It Again|Britney Spears|2000|O
In The Zone|Britney Spears|2003|O
Blackout|Britney Spears|2007|P
Circus|Britney Spears|2008|P
Millennium|Backstreet Boys|1999|O
Backstreet's Back|Backstreet Boys|1997|O
The Hits: Chapter One|Backstreet Boys|2001|O
No Strings Attached|*NSYNC|2000|O
Spice|Spice Girls|1996|O
Let Go|Avril Lavigne|2002|K
Under My Skin|Avril Lavigne|2004|K
The Best Damn Thing|Avril Lavigne|2007|K
Laundry Service|Shakira|2001|P
Oral Fixation Vol. 2|Shakira|2005|P
She Wolf|Shakira|2009|P
Dangerously In Love|Beyoncé|2003|N
B'Day|Beyoncé|2006|N
I AM...SASHA FIERCE|Beyoncé|2008|N
4|Beyoncé|2011|N
Lemonade|Beyoncé|2016|N
Confessions|Usher|2004|N
Raymond v Raymond|Usher|2010|N
Justified|Justin Timberlake|2002|O
FutureSex/LoveSounds|Justin Timberlake|2006|O
The 20/20 Experience|Justin Timberlake|2013|O
Speakerboxxx/The Love Below|Outkast|2003|H
Elephunk|Black Eyed Peas|2003|P
Monkey Business|Black Eyed Peas|2005|P
THE E.N.D.|Black Eyed Peas|2009|P
Animal|Kesha|2010|P
The Fame|Lady Gaga|2008|P
The Fame Monster|Lady Gaga|2009|P
Born This Way|Lady Gaga|2011|P
Chromatica|Lady Gaga|2020|P
One Of The Boys|Katy Perry|2008|O
Teenage Dream|Katy Perry|2010|O
PRISM|Katy Perry|2013|O
Witness|Katy Perry|2017|O
Good Girl Gone Bad|Rihanna|2007|O
Rated R|Rihanna|2009|O
Loud|Rihanna|2010|P
Talk That Talk|Rihanna|2011|P
Unapologetic|Rihanna|2012|O
ANTI|Rihanna|2016|N
Fearless|Taylor Swift|2008|O
Speak Now|Taylor Swift|2010|O
Red|Taylor Swift|2012|O
1989|Taylor Swift|2014|O
reputation|Taylor Swift|2017|O
Lover|Taylor Swift|2019|O
folklore|Taylor Swift|2020|C
Midnights|Taylor Swift|2022|O
THE TORTURED POETS DEPARTMENT|Taylor Swift|2024|O
19|Adele|2008|S
21|Adele|2011|S
25|Adele|2015|S
30|Adele|2021|S
+|Ed Sheeran|2011|O
x|Ed Sheeran|2014|O
÷|Ed Sheeran|2017|O
=|Ed Sheeran|2021|O
No.6 Collaborations Project|Ed Sheeran|2019|O
My World 2.0|Justin Bieber|2010|O
Believe|Justin Bieber|2012|O
Purpose|Justin Bieber|2015|O
Changes|Justin Bieber|2020|N
Justice|Justin Bieber|2021|O
Doo-Wops & Hooligans|Bruno Mars|2010|O
Unorthodox Jukebox|Bruno Mars|2012|O
24K Magic|Bruno Mars|2016|N
In The Lonely Hour|Sam Smith|2014|S
The Thrill Of It All|Sam Smith|2017|S
Up All Night|One Direction|2011|O
Take Me Home|One Direction|2012|O
Midnight Memories|One Direction|2013|O
FOUR|One Direction|2014|O
Made In The A.M.|One Direction|2015|O
Mind Of Mine|ZAYN|2016|N
Harry Styles|Harry Styles|2017|O
Fine Line|Harry Styles|2019|O
Harry's House|Harry Styles|2022|O
Handwritten|Shawn Mendes|2015|O
Illuminate|Shawn Mendes|2016|O
Shawn Mendes|Shawn Mendes|2018|O
Nine Track Mind|Charlie Puth|2016|O
Voicenotes|Charlie Puth|2018|O
Yours Truly|Ariana Grande|2013|N
My Everything|Ariana Grande|2014|O
Dangerous Woman|Ariana Grande|2016|O
Sweetener|Ariana Grande|2018|O
thank u, next|Ariana Grande|2019|O
Positions|Ariana Grande|2020|N
eternal sunshine|Ariana Grande|2024|O
Dua Lipa|Dua Lipa|2017|O
Future Nostalgia|Dua Lipa|2020|P
Radical Optimism|Dua Lipa|2024|P
dont smile at me|Billie Eilish|2017|C
WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?|Billie Eilish|2019|O
Happier Than Ever|Billie Eilish|2021|O
HIT ME HARD AND SOFT|Billie Eilish|2024|O
SOUR|Olivia Rodrigo|2021|O
GUTS|Olivia Rodrigo|2023|O
Short n' Sweet|Sabrina Carpenter|2024|O
Beauty Behind The Madness|The Weeknd|2015|N
Starboy|The Weeknd|2016|N
After Hours|The Weeknd|2020|N
Dawn FM|The Weeknd|2022|N
The Highlights|The Weeknd|2021|N
Stoney|Post Malone|2016|H
beerbongs & bentleys|Post Malone|2018|H
Hollywood's Bleeding|Post Malone|2019|O
Ctrl|SZA|2017|N
SOS|SZA|2022|N
Hot Pink|Doja Cat|2019|O
Planet Her|Doja Cat|2021|O
Bangerz|Miley Cyrus|2013|O
Endless Summer Vacation|Miley Cyrus|2023|O
1000 Forms Of Fear|Sia|2014|O
This Is Acting|Sia|2016|O
Halcyon Days|Ellie Goulding|2013|O
Delirium|Ellie Goulding|2015|O
Collage|The Chainsmokers|2016|P
Memories...Do Not Open|The Chainsmokers|2017|P
Different World|Alan Walker|2018|P
True|Avicii|2013|P
Stories|Avicii|2015|P
Nothing But The Beat|David Guetta|2011|P
Listen|David Guetta|2014|P
18 Months|Calvin Harris|2012|P
Motion|Calvin Harris|2014|P
Funk Wav Bounces Vol. 1|Calvin Harris|2017|P
Random Access Memories|Daft Punk|2013|P
Discovery|Daft Punk|2001|P
Peace Is The Mission|Major Lazer|2015|P
Encore|DJ Snake|2016|P
Planet Pit|Pitbull|2011|P
Global Warming|Pitbull|2012|P
Sorry For Party Rocking|LMFAO|2011|P
Uptown Special|Mark Ronson|2015|P
The Marshall Mathers LP|Eminem|2000|H
The Eminem Show|Eminem|2002|H
Encore|Eminem|2004|H
Recovery|Eminem|2010|H
The Marshall Mathers LP2|Eminem|2013|H
Curtain Call: The Hits|Eminem|2005|H
Kamikaze|Eminem|2018|H
Music To Be Murdered By|Eminem|2020|H
Get Rich Or Die Tryin'|50 Cent|2003|H
The Massacre|50 Cent|2005|H
The College Dropout|Kanye West|2004|H
Late Registration|Kanye West|2005|H
Graduation|Kanye West|2007|H
808s & Heartbreak|Kanye West|2008|H
My Beautiful Dark Twisted Fantasy|Kanye West|2010|H
The Blueprint 3|JAY-Z|2009|H
Watch The Throne|JAY-Z|2011|H
Take Care|Drake|2011|H
Nothing Was The Same|Drake|2013|H
Views|Drake|2016|H
Scorpion|Drake|2018|H
Certified Lover Boy|Drake|2021|H
good kid, m.A.A.d city|Kendrick Lamar|2012|H
To Pimp A Butterfly|Kendrick Lamar|2015|H
DAMN.|Kendrick Lamar|2017|H
GNX|Kendrick Lamar|2024|H
Rodeo|Travis Scott|2015|H
Birds In The Trap Sing McKnight|Travis Scott|2016|H
ASTROWORLD|Travis Scott|2018|H
UTOPIA|Travis Scott|2023|H
Goodbye & Good Riddance|Juice WRLD|2018|H
Death Race For Love|Juice WRLD|2019|H
17|XXXTENTACION|2017|H
?|XXXTENTACION|2018|H
2014 Forest Hills Drive|J. Cole|2014|H
Tha Carter III|Lil Wayne|2008|H
Doggystyle|Snoop Dogg|1993|H
2001|Dr. Dre|1999|H
Greatest Hits|2Pac|1998|H
Life After Death|The Notorious B.I.G.|1997|H
7|Lil Nas X|2019|H
MONTERO|Lil Nas X|2021|H
Rolling Papers|Wiz Khalifa|2011|H
Strange Trails|Lord Huron|2015|C
Dreamland|Glass Animals|2020|C
I Love You.|The Neighbourhood|2013|K
Wiped Out!|The Neighbourhood|2015|K
Long Way Down|Tom Odell|2013|S
Divinely Uninspired To A Hellish Extent|Lewis Capaldi|2019|S
Back from the Edge|James Arthur|2016|S
Love In The Future|John Legend|2013|R
Get Lifted|John Legend|2004|N
All the Little Lights|Passenger|2012|C
Dream Your Life Away|Vance Joy|2014|C
RUSH!|Måneskin|2023|K
Nothing But The Best|Frank Sinatra|2008|R
What A Wonderful World|Louis Armstrong|1968|C
The Greatest Showman|Hugh Jackman|2017|O
The Black Parade|My Chemical Romance|2006|K
RIOT!|Paramore|2007|K
Brand New Eyes|Paramore|2009|K
All the Right Reasons|Nickelback|2005|K
Silver Side Up|Nickelback|2001|K
Born To Die|Lana Del Rey|2012|S
Glory Days|Little Mix|2016|O
Breakaway|Kelly Clarkson|2004|O
I've Tried Everything But Therapy|Teddy Swims|2023|N
Fireworks & Rollerblades|Benson Boone|2024|O
Stick Season|Noah Kahan|2022|C
The Secret of Us|Gracie Abrams|2024|O
The Rise and Fall of a Midwest Princess|Chappell Roan|2023|O
THINK LATER|Tate McRae|2023|P
Rave & Roses|Rema|2022|P
F*CK LOVE 3: OVER YOU|The Kid LAROI|2021|O
Kid Krow|Conan Gray|2020|O
how i'm feeling|Lauv|2020|O
Narrated For You|Alec Benjamin|2018|O
American Teen|Khalid|2017|N
BADLANDS|Halsey|2015|O
Revival|Selena Gomez|2015|O
Rare|Selena Gomez|2020|O
Confident|Demi Lovato|2015|O
Camila|Camila Cabello|2018|O
7/27|Fifth Harmony|2016|O
What Is Love?|Clean Bandit|2018|P
Happiness Begins|Jonas Brothers|2019|O
Pray for the Wicked|Panic! At The Disco|2018|K
Save Rock And Roll|Fall Out Boy|2013|K
Only By The Night|Kings of Leon|2008|K
Eyes Open|Snow Patrol|2006|K
Hopes And Fears|Keane|2004|K
Science & Faith|The Script|2010|K
Still Not Getting Any...|Simple Plan|2004|K
No Name Face|Lifehouse|2000|K
Dizzy Up The Girl|The Goo Goo Dolls|1998|K
Savage Garden|Savage Garden|1997|O
Coast To Coast|Westlife|2000|O
Westlife|Westlife|1999|O
Escape|Enrique Iglesias|2001|O
Ricky Martin|Ricky Martin|1999|P
Aquarium|Aqua|1997|P
Europop|Eiffel 65|1999|P
Greatest Hits|Robbie Williams|2004|O
No Angel|Dido|1999|O
Come Away With Me|Norah Jones|2002|C
Back To Black|Amy Winehouse|2006|N
Life In Cartoon Motion|MIKA|2007|O
Back To Bedlam|James Blunt|2004|S
We Sing. We Dance. We Steal Things.|Jason Mraz|2008|C
Save Me, San Francisco|Train|2009|O
Ocean Eyes|Owl City|2009|O
Who You Are|Jessie J|2011|O
R.O.O.T.S.|Flo Rida|2009|P
Wild Ones|Flo Rida|2012|P
Rokstarr|Taio Cruz|2009|P
Jason Derulo|Jason Derulo|2010|P
Konvicted|Akon|2006|N
Freedom|Akon|2008|N
The Trinity|Sean Paul|2005|P
Loose|Nelly Furtado|2006|P
The Dutchess|Fergie|2006|O
PCD|The Pussycat Dolls|2005|P
Year Of The Gentleman|Ne-Yo|2008|N
F.A.M.E.|Chris Brown|2011|N
Demon Days|Gorillaz|2005|K
Oracular Spectacular|MGMT|2007|K
Greatest Hits|Foo Fighters|2009|K
Metallica|Metallica|1991|K
Greatest Hits|Bon Jovi|2010|K
The Final Countdown|Europe|1986|K
Eye Of The Tiger|Survivor|1982|K
...Hits|Phil Collins|1998|O
Make It Big|Wham!|1984|O
Whenever You Need Somebody|Rick Astley|1987|O
Songs From The Big Chair|Tears For Fears|1985|O
She's So Unusual|Cyndi Lauper|1983|O
Bridge Over Troubled Water|Simon & Garfunkel|1970|C
Forty Licks|The Rolling Stones|2002|K
Imagine|John Lennon|1971|O
American Pie|Don McLean|1971|C
Nightflight To Venus|Boney M.|1978|P
The 1st Album|Modern Talking|1985|P
#1's|Mariah Carey|1998|O
Daydream|Mariah Carey|1995|O
Music Box|Mariah Carey|1993|O
Stripped|Christina Aguilera|2002|O
Back To Basics|Christina Aguilera|2006|O
Come On Over|Shania Twain|1997|O
Jagged Little Pill|Alanis Morissette|1995|K
Ten|Pearl Jam|1991|K
Blood Sugar Sex Magik|Red Hot Chili Peppers|1991|K
Hysteria|Def Leppard|1987|K
1984|Van Halen|1984|K
Bat Out Of Hell|Meat Loaf|1977|K
Born To Run|Bruce Springsteen|1975|K
The Doors|The Doors|1967|K
Are You Experienced|The Jimi Hendrix Experience|1967|K
Let It Be|The Beatles|1970|K
Revolver|The Beatles|1966|K
Help!|The Beatles|1965|K
Who's Next|The Who|1971|K
Graceland|Paul Simon|1986|O
21st Century Breakdown|Green Day|2009|K
Black Holes And Revelations|Muse|2006|K
The Resistance|Muse|2009|K
Absolution|Muse|2003|K
Room For Squares|John Mayer|2001|C
Continuum|John Mayer|2006|C
Sigh No More|Mumford & Sons|2009|K
Babel|Mumford & Sons|2012|K
Sam's Town|The Killers|2006|K
Whatever People Say I Am, That's What I'm Not|Arctic Monkeys|2006|K
Is This It|The Strokes|2001|K
Franz Ferdinand|Franz Ferdinand|2004|K
Tragic Kingdom|No Doubt|1995|K
Ray Of Light|Madonna|1998|P
Confessions On A Dance Floor|Madonna|2005|P
Lungs|Florence + The Machine|2009|K
Ceremonials|Florence + The Machine|2011|K
Lights|Ellie Goulding|2010|O
Emotion|Carly Rae Jepsen|2015|O
Kiss|Carly Rae Jepsen|2012|O
Scarlet|Doja Cat|2023|H
Gloria|Sam Smith|2023|O
blonde|Frank Ocean|2016|N
channel ORANGE|Frank Ocean|2012|N
The Life Of Pablo|Kanye West|2016|H
Culture|Migos|2017|H
Man On The Moon: The End Of Day|Kid Cudi|2009|H
Pink Friday|Nicki Minaj|2010|H
Pink Friday ...Roman Reloaded|Nicki Minaj|2012|H
The Pinkprint|Nicki Minaj|2014|H
Invasion of Privacy|Cardi B|2018|H
`;
