/*
  Curated seed list of popular songs. The Library Builder resolves each line on
  Spotify (track id, cover, duration) and fetches lyrics from LRCLIB.

  Format:  Title | Main artist | Movie / Album | Year | Genre codes
  Genre codes:
    R Romantic   P Party & Dance   S Sad & Heartbreak   U Sufi & Soulful
    H Hip-Hop & Rap   K Rock   O Pop   J Punjabi   M Motivational & Patriotic
    C Chill & Indie   N R&B
  Add your own lines anywhere under the right "## hi" / "## en" header,
  then open Library -> Build and click "Import new seeds".
*/
window.SEEDS = `
## hi
Lag Ja Gale|Lata Mangeshkar|Woh Kaun Thi|1964|R S
Ajeeb Dastan Hai Yeh|Lata Mangeshkar|Dil Apna Aur Preet Parai|1960|R S
Pyar Kiya To Darna Kya|Lata Mangeshkar|Mughal-E-Azam|1960|R
Mere Sapno Ki Rani|Kishore Kumar|Aradhana|1969|R
Roop Tera Mastana|Kishore Kumar|Aradhana|1969|R
Kora Kagaz Tha Yeh Man Mera|Kishore Kumar|Aradhana|1969|R
Pal Pal Dil Ke Paas|Kishore Kumar|Blackmail|1973|R
Yeh Shaam Mastani|Kishore Kumar|Kati Patang|1970|R
Pyar Deewana Hota Hai|Kishore Kumar|Kati Patang|1970|R
Yeh Jo Mohabbat Hai|Kishore Kumar|Kati Patang|1970|S
Zindagi Ek Safar Hai Suhana|Kishore Kumar|Andaz|1971|M
Mere Naina Sawan Bhadon|Kishore Kumar|Mehbooba|1976|S
Chingari Koi Bhadke|Kishore Kumar|Amar Prem|1972|S
Kuch To Log Kahenge|Kishore Kumar|Amar Prem|1972|S
O Saathi Re|Kishore Kumar|Muqaddar Ka Sikandar|1978|S
Yeh Dosti|Kishore Kumar|Sholay|1975|M
Mehbooba Mehbooba|R. D. Burman|Sholay|1975|P
Dum Maro Dum|Asha Bhosle|Hare Rama Hare Krishna|1971|P
Piya Tu Ab To Aaja|Asha Bhosle|Caravan|1971|P
Chura Liya Hai Tumne Jo Dil Ko|Asha Bhosle|Yaadon Ki Baaraat|1973|R
Dil Cheez Kya Hai|Asha Bhosle|Umrao Jaan|1981|U
In Aankhon Ki Masti|Asha Bhosle|Umrao Jaan|1981|U
Ek Pyar Ka Nagma Hai|Lata Mangeshkar|Shor|1972|R
Tere Bina Zindagi Se|Lata Mangeshkar|Aandhi|1975|R S
Tum Aa Gaye Ho Noor Aa Gaya Hai|Kishore Kumar|Aandhi|1975|R
Tujhse Naraz Nahi Zindagi|Lata Mangeshkar|Masoom|1983|S
Ye Kahan Aa Gaye Hum|Lata Mangeshkar|Silsila|1981|R
Dekha Ek Khwab|Kishore Kumar|Silsila|1981|R
Rang Barse|Amitabh Bachchan|Silsila|1981|P
Khaike Paan Banaraswala|Kishore Kumar|Don|1978|P
Yeh Mera Dil|Asha Bhosle|Don|1978|P
Hum Tum Ek Kamre Mein Band Ho|Lata Mangeshkar|Bobby|1973|R
Main Shayar To Nahin|Shailendra Singh|Bobby|1973|R
Kabhi Kabhie Mere Dil Mein|Mukesh|Kabhi Kabhie|1976|R
Main Pal Do Pal Ka Shayar Hoon|Mukesh|Kabhi Kabhie|1976|S
Tere Chehre Se|Kishore Kumar|Kabhi Kabhie|1976|R
Kahin Door Jab Din Dhal Jaye|Mukesh|Anand|1971|S
Zindagi Kaisi Hai Paheli|Manna Dey|Anand|1971|S
Mera Joota Hai Japani|Mukesh|Shree 420|1955|M
Pyar Hua Iqrar Hua|Lata Mangeshkar|Shree 420|1955|R
Awara Hoon|Mukesh|Awaara|1951|O
Jeena Yahan Marna Yahan|Mukesh|Mera Naam Joker|1970|S
Tere Mere Sapne|Mohammed Rafi|Guide|1965|R
Gaata Rahe Mera Dil|Kishore Kumar|Guide|1965|R
Aaj Phir Jeene Ki Tamanna Hai|Lata Mangeshkar|Guide|1965|M
Chaudhvin Ka Chand|Mohammed Rafi|Chaudhvin Ka Chand|1960|R
Baharon Phool Barsao|Mohammed Rafi|Suraj|1966|R
Kya Hua Tera Wada|Mohammed Rafi|Hum Kisise Kum Naheen|1977|S
Bachna Ae Haseeno|Kishore Kumar|Hum Kisise Kum Naheen|1977|P
Yeh Chand Sa Roshan Chehra|Mohammed Rafi|Kashmir Ki Kali|1964|R
Likhe Jo Khat Tujhe|Mohammed Rafi|Kanyadaan|1968|R
Aaj Mausam Bada Beimaan Hai|Mohammed Rafi|Loafer|1973|R
Badan Pe Sitare|Mohammed Rafi|Prince|1969|P
Yahoo Chahe Koi Mujhe Junglee Kahe|Mohammed Rafi|Junglee|1961|P
O Mere Dil Ke Chain|Kishore Kumar|Mere Jeevan Saathi|1972|R
Ek Ajnabee Haseena Se|Kishore Kumar|Ajanabee|1974|R
Hum Dono Do Premi|Kishore Kumar|Ajanabee|1974|R
Tere Bina Jiya Jaye Na|Lata Mangeshkar|Ghar|1978|R
Aap Ki Aankhon Mein Kuch|Kishore Kumar|Ghar|1978|R
Musafir Hoon Yaron|Kishore Kumar|Parichay|1972|M
Rimjhim Gire Sawan|Kishore Kumar|Manzil|1979|R
Aane Wala Pal Jane Wala Hai|Kishore Kumar|Gol Maal|1979|M
Hawa Hawai|Kavita Krishnamurthy|Mr. India|1987|P
Kate Nahin Kat Te|Kishore Kumar|Mr. India|1987|R
Ek Do Teen|Alka Yagnik|Tezaab|1988|P
Papa Kehte Hain|Udit Narayan|Qayamat Se Qayamat Tak|1988|M
Ae Mere Humsafar|Udit Narayan|Qayamat Se Qayamat Tak|1988|R
Gazab Ka Hai Din|Udit Narayan|Qayamat Se Qayamat Tak|1988|R
Mere Rang Mein Rangne Wali|S. P. Balasubrahmanyam|Maine Pyar Kiya|1989|R
Dil Deewana|Lata Mangeshkar|Maine Pyar Kiya|1989|R
Kabootar Ja Ja Ja|Lata Mangeshkar|Maine Pyar Kiya|1989|R
Aaja Shaam Hone Aayi|Lata Mangeshkar|Maine Pyar Kiya|1989|R
Mere Haathon Mein Nau Nau Chooriyan|Lata Mangeshkar|Chandni|1989|P
Tirchi Topiwale|Amit Kumar|Tridev|1989|P
My Name Is Lakhan|Mohammed Aziz|Ram Lakhan|1989|P
Tumse Milke|Suresh Wadkar|Parinda|1989|R
Jimmy Jimmy Aaja Aaja|Parvati Khan|Disco Dancer|1982|P
I Am A Disco Dancer|Vijay Benedict|Disco Dancer|1982|P
Zindagi Ke Safar Mein|Kishore Kumar|Aap Ki Kasam|1974|S
Jai Jai Shiv Shankar|Kishore Kumar|Aap Ki Kasam|1974|P
Saagar Kinare|Kishore Kumar|Saagar|1985|R
Hothon Se Chhoo Lo Tum|Jagjit Singh|Prem Geet|1981|U
Tum Itna Jo Muskura Rahe Ho|Jagjit Singh|Arth|1982|U
Chitthi Aayi Hai|Pankaj Udhas|Naam|1986|S
Neele Neele Ambar Par|Kishore Kumar|Kalaakaar|1983|R
O Mere Sona Re|Asha Bhosle|Teesri Manzil|1966|R
Aaja Aaja Main Hoon Pyar Tera|Asha Bhosle|Teesri Manzil|1966|P
Eena Meena Deeka|Kishore Kumar|Aasha|1957|P
Ek Ladki Bheegi Bhaagi Si|Kishore Kumar|Chalti Ka Naam Gaadi|1958|R
Mere Mehboob Qayamat Hogi|Kishore Kumar|Mr. X in Bombay|1964|S
Dil Kya Kare|Kishore Kumar|Julie|1975|R
Aye Mere Watan Ke Logo|Lata Mangeshkar|Aye Mere Watan Ke Logo|1963|M
Mere Desh Ki Dharti|Mahendra Kapoor|Upkar|1967|M
Kar Chale Hum Fida|Mohammed Rafi|Haqeeqat|1964|M
Abhi Na Jao Chhod Kar|Mohammed Rafi|Hum Dono|1961|R
Tu Is Tarah Se Meri Zindagi Mein|Mohammed Rafi|Aap To Aise Na The|1980|R
Dard-E-Dil Dard-E-Jigar|Mohammed Rafi|Karz|1980|R
Om Shanti Om|Kishore Kumar|Karz|1980|P
Ek Haseena Thi|Kishore Kumar|Karz|1980|P
Pyar Hamen Kis Mod Pe|Kishore Kumar|Satte Pe Satta|1982|P
Jaanu Meri Jaan|Kishore Kumar|Shaan|1980|P
Pyaar Karne Wale|Asha Bhosle|Shaan|1980|P
Humein Tumse Pyar Kitna|Kishore Kumar|Kudrat|1981|R
Hum Bane Tum Bane|S. P. Balasubrahmanyam|Ek Duuje Ke Liye|1981|R
Tere Mere Beech Mein|Lata Mangeshkar|Ek Duuje Ke Liye|1981|R
Gulabi Aankhen|Mohammed Rafi|The Train|1970|R
Mere Saamne Wali Khidki Mein|Kishore Kumar|Padosan|1968|R
Ek Chatur Naar|Kishore Kumar|Padosan|1968|P
Raat Kali Ek Khwab Mein|Kishore Kumar|Buddha Mil Gaya|1971|R
Aaj Kal Tere Mere Pyar Ke Charche|Mohammed Rafi|Brahmachari|1968|R
Chalo Ek Baar Phir Se|Mahendra Kapoor|Gumrah|1963|S
Aap Jaisa Koi|Nazia Hassan|Qurbani|1980|P
Laila O Laila|Kanchan|Qurbani|1980|P
Disco Deewane|Nazia Hassan|Disco Deewane|1981|P
Tujhe Dekha To|Lata Mangeshkar|Dilwale Dulhania Le Jayenge|1995|R
Mere Khwabon Mein|Lata Mangeshkar|Dilwale Dulhania Le Jayenge|1995|R
Ho Gaya Hai Tujhko|Lata Mangeshkar|Dilwale Dulhania Le Jayenge|1995|R
Mehndi Laga Ke Rakhna|Lata Mangeshkar|Dilwale Dulhania Le Jayenge|1995|P
Zara Sa Jhoom Loon Main|Asha Bhosle|Dilwale Dulhania Le Jayenge|1995|P
Ruk Ja O Dil Deewane|Udit Narayan|Dilwale Dulhania Le Jayenge|1995|P
Kuch Kuch Hota Hai|Udit Narayan|Kuch Kuch Hota Hai|1998|R
Koi Mil Gaya|Udit Narayan|Kuch Kuch Hota Hai|1998|R P
Ladki Badi Anjani Hai|Kumar Sanu|Kuch Kuch Hota Hai|1998|R
Tujhe Yaad Na Meri Aayee|Udit Narayan|Kuch Kuch Hota Hai|1998|S
Saajanji Ghar Aaye|Kavita Krishnamurthy|Kuch Kuch Hota Hai|1998|P
Chaiyya Chaiyya|Sukhwinder Singh|Dil Se..|1998|P U
Dil Se Re|A.R. Rahman|Dil Se..|1998|U
Jiya Jale|Lata Mangeshkar|Dil Se..|1998|R
Ae Ajnabi|Udit Narayan|Dil Se..|1998|S
Tu Hi Re|Hariharan|Bombay|1995|R
Kehna Hi Kya|K. S. Chithra|Bombay|1995|R
Humma Humma|Remo Fernandes|Bombay|1995|P
Ek Ladki Ko Dekha|Kumar Sanu|1942 A Love Story|1994|R
Kuch Na Kaho|Kumar Sanu|1942 A Love Story|1994|R
Pehla Nasha|Udit Narayan|Jo Jeeta Wohi Sikandar|1992|R
Didi Tera Devar Deewana|Lata Mangeshkar|Hum Aapke Hain Koun..!|1994|P
Pehla Pehla Pyar Hai|S. P. Balasubrahmanyam|Hum Aapke Hain Koun..!|1994|R
Tu Cheez Badi Hai Mast Mast|Udit Narayan|Mohra|1994|P
Tip Tip Barsa Pani|Alka Yagnik|Mohra|1994|R
Na Kajre Ki Dhar|Pankaj Udhas|Mohra|1994|R
Choli Ke Peeche|Alka Yagnik|Khal Nayak|1993|P
Baazigar O Baazigar|Kumar Sanu|Baazigar|1993|R
Yeh Kaali Kaali Aankhen|Kumar Sanu|Baazigar|1993|R
Chhupana Bhi Nahin Aata|Vinod Rathod|Baazigar|1993|R
Jaadu Teri Nazar|Udit Narayan|Darr|1993|R
Tu Mere Saamne|Udit Narayan|Darr|1993|R
Ghar Se Nikalte Hi|Udit Narayan|Papa Kehte Hain|1996|R
Kitna Pyara Tujhe Rab Ne Banaya|Kumar Sanu|Raja Hindustani|1996|R
Pardesi Pardesi|Udit Narayan|Raja Hindustani|1996|S
Aaye Ho Meri Zindagi Mein|Udit Narayan|Raja Hindustani|1996|R
Sandese Aate Hai|Sonu Nigam|Border|1997|M
To Chalun|Sonu Nigam|Border|1997|S
Dil To Pagal Hai|Lata Mangeshkar|Dil To Pagal Hai|1997|R
Are Re Are|Lata Mangeshkar|Dil To Pagal Hai|1997|R
Bholi Si Surat|Lata Mangeshkar|Dil To Pagal Hai|1997|R
Koi Ladki Hai|Lata Mangeshkar|Dil To Pagal Hai|1997|P
Le Gayi Le Gayi|Asha Bhosle|Dil To Pagal Hai|1997|P
Chand Chupa Badal Mein|Udit Narayan|Hum Dil De Chuke Sanam|1999|R
Tadap Tadap Ke|KK|Hum Dil De Chuke Sanam|1999|S
Nimbooda|Kavita Krishnamurthy|Hum Dil De Chuke Sanam|1999|P
Aankhon Ki Gustakhiyan|Kavita Krishnamurthy|Hum Dil De Chuke Sanam|1999|R
Dholi Taro|Kavita Krishnamurthy|Hum Dil De Chuke Sanam|1999|P
Taal Se Taal Mila|Alka Yagnik|Taal|1999|R
Ishq Bina|Anuradha Sriram|Taal|1999|R
Kahin Aag Lage|Asha Bhosle|Taal|1999|P
Ramta Jogi|Alka Yagnik|Taal|1999|U
Mere Mehboob Mere Sanam|Udit Narayan|Duplicate|1998|R
Aisi Deewangi|Alka Yagnik|Deewana|1992|R
Sochenge Tumhe Pyar|Kumar Sanu|Deewana|1992|R
Tere Dard Se Dil|Kumar Sanu|Deewana|1992|S
Jeeta Tha Jiske Liye|Kumar Sanu|Dilwale|1994|S
Saanson Ki Zaroorat Hai Jaise|Kumar Sanu|Aashiqui|1990|R
Dheere Dheere Se|Kumar Sanu|Aashiqui|1990|R
Nazar Ke Samne|Kumar Sanu|Aashiqui|1990|R
Mera Dil Bhi Kitna Pagal Hai|Kumar Sanu|Saajan|1991|R
Dekha Hai Pehli Baar|Alka Yagnik|Saajan|1991|R
Bahut Pyar Karte Hain|S. P. Balasubrahmanyam|Saajan|1991|R
Tumse Milne Ki Tamanna Hai|S. P. Balasubrahmanyam|Saajan|1991|R
Dhak Dhak Karne Laga|Anuradha Paudwal|Beta|1992|P
Tamma Tamma Loge|Bappi Lahiri|Thanedaar|1990|P
Jumma Chumma De De|Sudesh Bhosle|Hum|1991|P
Main Khiladi Tu Anari|Udit Narayan|Main Khiladi Tu Anari|1994|P
Chura Ke Dil Mera|Kumar Sanu|Main Khiladi Tu Anari|1994|R
Yeh Dil Deewana|Sonu Nigam|Pardes|1997|R
Do Dil Mil Rahe Hain|Kumar Sanu|Pardes|1997|R
I Love My India|Kavita Krishnamurthy|Pardes|1997|M
Meri Mehbooba|Kumar Sanu|Pardes|1997|R
Kisi Disco Mein Jaaye|Udit Narayan|Bade Miyan Chote Miyan|1998|P
Ole Ole|Abhijeet|Yeh Dillagi|1994|P
Akhiyon Se Goli Maare|Sonu Nigam|Dulhe Raja|1998|P
Sona Kitna Sona Hai|Udit Narayan|Hero No. 1|1997|P
Husn Hai Suhana|Abhijeet|Coolie No. 1|1995|P
Main To Raste Se Ja Raha Tha|Kumar Sanu|Coolie No. 1|1995|P
Sheher Ki Ladki|Abhijeet|Rakshak|1996|P
Ankhiyaan Milaoon Kabhi|Alka Yagnik|Raja|1995|R
Morni Baga Ma|Lata Mangeshkar|Lamhe|1991|P
Mujhe Neend Na Aaye|Udit Narayan|Dil|1990|R
Hum Pyar Karne Wale|Anuradha Paudwal|Dil|1990|R
Jab Koi Baat Bigad Jaye|Kumar Sanu|Jurm|1990|R
Tu Pyar Hai Kisi Aur Ka|Kumar Sanu|Dil Hai Ki Manta Nahin|1991|S
Dil Hai Ki Manta Nahin|Kumar Sanu|Dil Hai Ki Manta Nahin|1991|R
Chaha Hai Tujhko|Udit Narayan|Mann|1999|R
Nasha Yeh Pyar Ka Nasha|Udit Narayan|Mann|1999|R
Yeh Haseen Wadiyan|S. P. Balasubrahmanyam|Roja|1992|R
Dil Hai Chhota Sa|Minmini|Roja|1992|R
Bharat Humko Jaan Se Pyara Hai|Hariharan|Roja|1992|M
Mustt Mustt|Nusrat Fateh Ali Khan|Mustt Mustt|1990|U
Afreen Afreen|Nusrat Fateh Ali Khan|Sangam|1996|U
Made In India|Alisha Chinai|Made in India|1995|O
Tunak Tunak Tun|Daler Mehndi|Tunak Tunak Tun|1998|J P
Bolo Ta Ra Ra|Daler Mehndi|Bolo Ta Ra Ra|1995|J P
Mundian To Bach Ke|Panjabi MC|Legalised|1998|J P
O Sanam|Lucky Ali|Sunoh|1996|O
Yaaron|KK|Pal|1999|M
Pal|KK|Pal|1999|S M
Chaand Taare|Abhijeet|Yes Boss|1997|M
Main Koi Aisa Geet Gaoon|Abhijeet|Yes Boss|1997|R
Ek Din Aap|Kumar Sanu|Yes Boss|1997|R
Bahon Ke Darmiyan|Hariharan|Khamoshi The Musical|1996|R
Aaj Main Upar|Kumar Sanu|Khamoshi The Musical|1996|R
Is Tarah Aashiqui Ka|Kumar Sanu|Imtihan|1994|R
Ek Pal Ka Jeena|Lucky Ali|Kaho Naa Pyaar Hai|2000|P
Kaho Naa Pyaar Hai|Udit Narayan|Kaho Naa Pyaar Hai|2000|R
Na Tum Jaano Na Hum|Lucky Ali|Kaho Naa Pyaar Hai|2000|R
Dil Ne Yeh Kaha Hai Dil Se|Udit Narayan|Dhadkan|2000|R
Tum Dil Ki Dhadkan Mein|Abhijeet|Dhadkan|2000|R
Dulhe Ka Sehra|Nusrat Fateh Ali Khan|Dhadkan|2000|S
Aankhein Khuli Ho Ya|Lata Mangeshkar|Mohabbatein|2000|R
Humko Humise Chura Lo|Lata Mangeshkar|Mohabbatein|2000|R
Pairon Mein Bandhan Hai|Udit Narayan|Mohabbatein|2000|P
Ek Garam Chai Ki Pyali|Hariharan|Har Dil Jo Pyar Karega|2000|P
Suraj Hua Maddham|Sonu Nigam|Kabhi Khushi Kabhie Gham|2001|R
Bole Chudiyan|Amitabh Bachchan|Kabhi Khushi Kabhie Gham|2001|P
Shava Shava|Amitabh Bachchan|Kabhi Khushi Kabhie Gham|2001|P
You Are My Soniya|Sonu Nigam|Kabhi Khushi Kabhie Gham|2001|P
Kabhi Khushi Kabhie Gham|Lata Mangeshkar|Kabhi Khushi Kabhie Gham|2001|S
Yeh Ladka Hai Allah|Alka Yagnik|Kabhi Khushi Kabhie Gham|2001|R
Dil Chahta Hai|Shankar Mahadevan|Dil Chahta Hai|2001|M
Koi Kahe Kehta Rahe|Shankar Mahadevan|Dil Chahta Hai|2001|P
Jaane Kyun|Udit Narayan|Dil Chahta Hai|2001|R
Tanhayee|Sonu Nigam|Dil Chahta Hai|2001|S
Woh Ladki Hai Kahan|Shaan|Dil Chahta Hai|2001|R
Udd Jaa Kaale Kaava|Udit Narayan|Gadar|2001|R
Main Nikla Gaddi Leke|Udit Narayan|Gadar|2001|P
Kal Ho Naa Ho|Sonu Nigam|Kal Ho Naa Ho|2003|S
It's The Time To Disco|Shaan|Kal Ho Naa Ho|2003|P
Maahi Ve|Udit Narayan|Kal Ho Naa Ho|2003|P
Kuch To Hua Hai|Shaan|Kal Ho Naa Ho|2003|R
Pretty Woman|Shankar Mahadevan|Kal Ho Naa Ho|2003|P
Chalte Chalte|Abhijeet|Chalte Chalte|2003|R
Suno Na Suno Na|Abhijeet|Chalte Chalte|2003|R
Tauba Tumhare Ishare|Abhijeet|Chalte Chalte|2003|R
Idhar Chala Main Udhar Chala|Udit Narayan|Koi... Mil Gaya|2003|R
Tere Naam|Udit Narayan|Tere Naam|2003|S
Allah Ke Bande|Kailash Kher|Waisa Bhi Hota Hai Part II|2003|U
Sharara Sharara|Asha Bhosle|Mere Yaar Ki Shaadi Hai|2002|P
Mere Yaar Ki Shaadi Hai|Udit Narayan|Mere Yaar Ki Shaadi Hai|2002|P
Ishq Kameena|Sonu Nigam|Shakti|2002|P
Dil Laga Liya|Alka Yagnik|Dil Hai Tumhaara|2002|R
Tera Chehra|Adnan Sami|Tera Chehra|2002|R
Lift Karadey|Adnan Sami|Tera Chehra|2002|P
Kabhi Toh Nazar Milao|Adnan Sami|Kabhi Toh Nazar Milao|2001|R
Main Hoon Na|Sonu Nigam|Main Hoon Na|2004|R
Tumse Milke Dil Ka|Sonu Nigam|Main Hoon Na|2004|P U
Chale Jaise Hawaien|Vasundhara Das|Main Hoon Na|2004|P
Gori Gori|Anu Malik|Main Hoon Na|2004|P
Tere Liye|Lata Mangeshkar|Veer-Zaara|2004|R
Main Yahaan Hoon|Udit Narayan|Veer-Zaara|2004|R
Aisa Des Hai Mera|Lata Mangeshkar|Veer-Zaara|2004|M
Do Pal|Lata Mangeshkar|Veer-Zaara|2004|S
Jaanam Dekh Lo|Sonu Nigam|Veer-Zaara|2004|R
Lodi|Lata Mangeshkar|Veer-Zaara|2004|P
Yeh Jo Des Hai Tera|A.R. Rahman|Swades|2004|M
Yun Hi Chala Chal|Udit Narayan|Swades|2004|M
Dhoom Machale|Sunidhi Chauhan|Dhoom|2004|P
Shikdum|Shaan|Dhoom|2004|R
Bheegey Honth Tere|Kunal Ganjawala|Murder|2004|R
Kaho Na Kaho|Amir Jamal|Murder|2004|R
Mujhse Shaadi Karogi|Sonu Nigam|Mujhse Shaadi Karogi|2004|P
Lal Dupatta|Udit Narayan|Mujhse Shaadi Karogi|2004|R
Rab Kare Tujhko Bhi|Sonu Nigam|Mujhse Shaadi Karogi|2004|R
Hum Tum|Babul Supriyo|Hum Tum|2004|R
Mann Ki Lagan|Rahat Fateh Ali Khan|Paap|2004|U
Kajra Re|Alisha Chinai|Bunty Aur Babli|2005|P
Nach Baliye|Shankar Mahadevan|Bunty Aur Babli|2005|P
Woh Lamhe Woh Baatein|Atif Aslam|Zeher|2005|S
Agar Tum Mil Jao|Shreya Ghoshal|Zeher|2005|R
Aadat|Atif Aslam|Kalyug|2005|S
Jiya Dhadak Dhadak|Rahat Fateh Ali Khan|Kalyug|2005|S
Aashiq Banaya Aapne|Himesh Reshammiya|Aashiq Banaya Aapne|2005|R
Aap Ki Kashish|Himesh Reshammiya|Aashiq Banaya Aapne|2005|R
Salaam Namaste|Kunal Ganjawala|Salaam Namaste|2005|P
My Dil Goes Mmmm|Shaan|Salaam Namaste|2005|R
Dus Bahane|KK|Dus|2005|P
Deedar De|Sunidhi Chauhan|Dus|2005|P
Mora Saiyaan|Shafqat Amanat Ali|Fuzon|2005|U
Rang De Basanti|Daler Mehndi|Rang De Basanti|2006|M
Masti Ki Paathshaala|Naresh Iyer|Rang De Basanti|2006|P
Roobaroo|A.R. Rahman|Rang De Basanti|2006|M
Khalbali|A.R. Rahman|Rang De Basanti|2006|P
Luka Chuppi|Lata Mangeshkar|Rang De Basanti|2006|S
Tu Bin Bataye|Madhushree|Rang De Basanti|2006|R
Crazy Kiya Re|Sunidhi Chauhan|Dhoom 2|2006|P
Dhoom Again|Vishal Dadlani|Dhoom 2|2006|P
Beedi|Sukhwinder Singh|Omkara|2006|P
Namak Ishq Ka|Rekha Bhardwaj|Omkara|2006|P
Mitwa|Shankar Mahadevan|Kabhi Alvida Naa Kehna|2006|R
Tumhi Dekho Naa|Sonu Nigam|Kabhi Alvida Naa Kehna|2006|R
Where's The Party Tonight|Shaan|Kabhi Alvida Naa Kehna|2006|P
Kabhi Alvida Naa Kehna|Sonu Nigam|Kabhi Alvida Naa Kehna|2006|S
Rock N Roll Soniye|Shankar Mahadevan|Kabhi Alvida Naa Kehna|2006|P
Mere Haath Mein|Sonu Nigam|Fanaa|2006|R
Chand Sifarish|Shaan|Fanaa|2006|R
Des Rangila|Mahalakshmi Iyer|Fanaa|2006|M
Dil Na Diya|KK|Krrish|2006|R
Koi Tumsa Nahin|Sonu Nigam|Krrish|2006|R
Kya Mujhe Pyar Hai|KK|Woh Lamhe|2006|R
Tu Hi Meri Shab Hai|KK|Gangster|2006|R
Ya Ali|Zubeen Garg|Gangster|2006|R
Jhalak Dikhlaja|Himesh Reshammiya|Aksar|2006|P
Teri Deewani|Kailash Kher|Kailasa|2006|U
Doorie|Atif Aslam|Doorie|2006|S
Tere Bin|Atif Aslam|Bas Ek Pal|2006|S
Chak De India|Sukhwinder Singh|Chak De! India|2007|M
Saawariya|Shreya Ghoshal|Saawariya|2007|R
Jab Se Tere Naina|Shaan|Saawariya|2007|R
Aankhon Mein Teri|KK|Om Shanti Om|2007|R
Ajab Si|KK|Om Shanti Om|2007|R
Dard-E-Disco|Sukhwinder Singh|Om Shanti Om|2007|P
Dhoom Taana|Shreya Ghoshal|Om Shanti Om|2007|P
Main Agar Kahoon|Sonu Nigam|Om Shanti Om|2007|R
Jag Soona Soona Lage|Rahat Fateh Ali Khan|Om Shanti Om|2007|S
Deewangi Deewangi|Shaan|Om Shanti Om|2007|P
Mauja Hi Mauja|Mika Singh|Jab We Met|2007|P
Yeh Ishq Haaye|Shreya Ghoshal|Jab We Met|2007|R
Tum Se Hi|Mohit Chauhan|Jab We Met|2007|R
Nagada Nagada|Sonu Nigam|Jab We Met|2007|P
Aaoge Jab Tum|Ustad Rashid Khan|Jab We Met|2007|U
Bum Bum Bole|Shaan|Taare Zameen Par|2007|M
Maa|Shankar Mahadevan|Taare Zameen Par|2007|S
Taare Zameen Par|Shankar Mahadevan|Taare Zameen Par|2007|M
Tere Bina|A.R. Rahman|Guru|2007|U
Barso Re|Shreya Ghoshal|Guru|2007|P
Mayya Mayya|Maryem Tollar|Guru|2007|P
Bhool Bhulaiyaa|Neeraj Shridhar|Bhool Bhulaiyaa|2007|P
Labon Ko|KK|Bhool Bhulaiyaa|2007|R
Ami Je Tomar|Shreya Ghoshal|Bhool Bhulaiyaa|2007|U
Jhoom Barabar Jhoom|Shankar Mahadevan|Jhoom Barabar Jhoom|2007|P
Bol Na Halke Halke|Rahat Fateh Ali Khan|Jhoom Barabar Jhoom|2007|R
Soni De Nakhre|Labh Janjua|Partner|2007|P J
Do You Wanna Partner|Udit Narayan|Partner|2007|P
Hey Shona|Shaan|Ta Ra Rum Pum|2007|R
O Re Piya|Rahat Fateh Ali Khan|Aaja Nachle|2007|U
Tera Suroor|Himesh Reshammiya|Aap Kaa Surroor|2007|R
Jai Ho|A.R. Rahman|Slumdog Millionaire|2008|P
Tujh Mein Rab Dikhta Hai|Roop Kumar Rathod|Rab Ne Bana Di Jodi|2008|R U
Haule Haule|Sukhwinder Singh|Rab Ne Bana Di Jodi|2008|R
Dance Pe Chance|Sunidhi Chauhan|Rab Ne Bana Di Jodi|2008|P
Phir Milenge Chalte Chalte|Sonu Nigam|Rab Ne Bana Di Jodi|2008|P
Pehli Nazar Mein|Atif Aslam|Race|2008|R
Zara Zara Touch Me|Monali Thakur|Race|2008|P
Khwaja Mere Khwaja|A.R. Rahman|Jodhaa Akbar|2008|U
Jashn-E-Bahaara|Javed Ali|Jodhaa Akbar|2008|R
Kabhi Kabhi Aditi|Rashid Ali|Jaane Tu... Ya Jaane Na|2008|M
Pappu Can't Dance|Benny Dayal|Jaane Tu... Ya Jaane Na|2008|P
Kahin To|Rashid Ali|Jaane Tu... Ya Jaane Na|2008|R
Guzarish|Javed Ali|Ghajini|2008|R
Behka|Karthik|Ghajini|2008|R
Kaise Mujhe|Benny Dayal|Ghajini|2008|R
Aye Bachchu|Suzanne D'Mello|Ghajini|2008|P
Socha Hai|Farhan Akhtar|Rock On!!|2008|K
Sinbad The Sailor|Farhan Akhtar|Rock On!!|2008|K
Tum Ho To|Farhan Akhtar|Rock On!!|2008|K R
Pichle Saat Dinon Mein|Farhan Akhtar|Rock On!!|2008|K
Teri Ore|Rahat Fateh Ali Khan|Singh Is Kinng|2008|R
Singh Is Kinng|RDB|Singh Is Kinng|2008|P J
Desi Girl|Shankar Mahadevan|Dostana|2008|P
Shut Up And Bounce|Sunidhi Chauhan|Dostana|2008|P
Maa Da Ladla|Master Saleem|Dostana|2008|P
Zara Sa|KK|Jannat|2008|R
Haan Tu Hai|KK|Jannat|2008|R
All Izz Well|Sonu Nigam|3 Idiots|2009|P M
Give Me Some Sunshine|Suraj Jagan|3 Idiots|2009|M
Zoobi Doobi|Sonu Nigam|3 Idiots|2009|R
Behti Hawa Sa Tha Woh|Shaan|3 Idiots|2009|S
Jaane Nahin Denge Tujhe|Sonu Nigam|3 Idiots|2009|S
Masakali|Mohit Chauhan|Delhi-6|2009|O
Rehna Tu|A.R. Rahman|Delhi-6|2009|R
Genda Phool|Rekha Bhardwaj|Delhi-6|2009|P
Tum Mile|Neeraj Shridhar|Tum Mile|2009|R
Dil Ibaadat|KK|Tum Mile|2009|R
Tu Hi Haqeeqat|Javed Ali|Tum Mile|2009|R
Tu Jaane Na|Atif Aslam|Ajab Prem Ki Ghazab Kahani|2009|S
Tera Hone Laga Hoon|Atif Aslam|Ajab Prem Ki Ghazab Kahani|2009|R
Prem Ki Naiyya|Neeraj Shridhar|Ajab Prem Ki Ghazab Kahani|2009|P
Aahun Aahun|Neeraj Shridhar|Love Aaj Kal|2009|P J
Chor Bazari|Neeraj Shridhar|Love Aaj Kal|2009|P
Yeh Dooriyan|Mohit Chauhan|Love Aaj Kal|2009|S
Twist|Neeraj Shridhar|Love Aaj Kal|2009|P
Ajj Din Chadheya|Rahat Fateh Ali Khan|Love Aaj Kal|2009|U
Kaminey|Vishal Bhardwaj|Kaminey|2009|K
Dhan Te Nan|Sukhwinder Singh|Kaminey|2009|P
Pehli Baar Mohabbat|Mohit Chauhan|Kaminey|2009|R
Emotional Atyachar|Bony Sen Gupta|Dev.D|2009|P
Bheegi Si Bhaagi Si|Mohit Chauhan|Raaz - The Mystery Continues|2009|R
Soniyo|Sonu Nigam|Raaz - The Mystery Continues|2009|R
Saiyyan|Kailash Kher|Jhoomo Re|2009|U
Iktara|Kavita Seth|Wake Up Sid|2009|C
Tujhe Bhula Diya|Mohit Chauhan|Anjaana Anjaani|2010|S
Sajda|Rahat Fateh Ali Khan|My Name Is Khan|2010|U
Noor-e-Khuda|Adnan Sami|My Name Is Khan|2010|U
Tere Naina|Shafqat Amanat Ali|My Name Is Khan|2010|R
Bin Tere|Vishal Dadlani|I Hate Luv Storys|2010|R
Ainvayi Ainvayi|Salim Merchant|Band Baaja Baaraat|2010|P
Sheila Ki Jawani|Sunidhi Chauhan|Tees Maar Khan|2010|P
Munni Badnaam Hui|Mamta Sharma|Dabangg|2010|P
Tere Mast Mast Do Nain|Rahat Fateh Ali Khan|Dabangg|2010|R
Chori Kiya Re Jiya|Sonu Nigam|Dabangg|2010|R
Pee Loon|Mohit Chauhan|Once Upon A Time In Mumbaai|2010|R
Tum Jo Aaye|Rahat Fateh Ali Khan|Once Upon A Time In Mumbaai|2010|R
Tujhko Jo Paaya|Mohit Chauhan|Crook|2010|R
Mere Bina|Nikhil D'Souza|Crook|2010|R
Kun Faya Kun|A.R. Rahman|Rockstar|2011|U
Nadaan Parindey|A.R. Rahman|Rockstar|2011|K
Sadda Haq|Mohit Chauhan|Rockstar|2011|K
Jo Bhi Main|Mohit Chauhan|Rockstar|2011|K
Tum Ho|Mohit Chauhan|Rockstar|2011|R
Phir Se Ud Chala|Mohit Chauhan|Rockstar|2011|M
Kateya Karun|Harshdeep Kaur|Rockstar|2011|J
Senorita|Farhan Akhtar|Zindagi Na Milegi Dobara|2011|P
Ik Junoon|Vishal Dadlani|Zindagi Na Milegi Dobara|2011|M
Der Lagi Lekin|Shankar Mahadevan|Zindagi Na Milegi Dobara|2011|M
Khaabon Ke Parinday|Mohit Chauhan|Zindagi Na Milegi Dobara|2011|R
Dil Dhadakne Do|Shankar Mahadevan|Zindagi Na Milegi Dobara|2011|M
Chammak Challo|Akon|Ra.One|2011|P
Criminal|Akon|Ra.One|2011|P
Dildaara|Shafqat Amanat Ali|Ra.One|2011|R
Teri Meri|Rahat Fateh Ali Khan|Bodyguard|2011|R
Dhinka Chika|Mika Singh|Ready|2011|P
Character Dheela|Neeraj Shridhar|Ready|2011|P
Ooh La La|Shreya Ghoshal|The Dirty Picture|2011|P
Ishq Sufiyana|Kamal Khan|The Dirty Picture|2011|U
Dil Sambhal Ja Zara|Arijit Singh|Murder 2|2011|S
Phir Mohabbat|Arijit Singh|Murder 2|2011|R
Haale Dil|Harshit Saxena|Murder 2|2011|R
Saathiya|Sonu Nigam|Singham|2011|R
Brown Rang|Yo Yo Honey Singh|International Villager|2011|P H J
Saibo|Shreya Ghoshal|Shor in the City|2011|R
Fevicol Se|Mamta Sharma|Dabangg 2|2012|P
Chikni Chameli|Shreya Ghoshal|Agneepath|2012|P
Abhi Mujh Mein Kahin|Sonu Nigam|Agneepath|2012|S
Deva Shree Ganesha|Ajay Gogavale|Agneepath|2012|P
Saiyaara|Mohit Chauhan|Ek Tha Tiger|2012|R
Mashallah|Wajid|Ek Tha Tiger|2012|P
Laapata|KK|Ek Tha Tiger|2012|P
Angreji Beat|Yo Yo Honey Singh|Cocktail|2012|P
Tumhi Ho Bandhu|Neeraj Shridhar|Cocktail|2012|P
Daaru Desi|Benny Dayal|Cocktail|2012|P
Yaariyan|Arijit Singh|Cocktail|2012|R
Raabta|Arijit Singh|Agent Vinod|2012|R
Pyaar Ki Pungi|Mika Singh|Agent Vinod|2012|P
Ishq Wala Love|Salim Merchant|Student of the Year|2012|R
The Disco Song|Sunidhi Chauhan|Student of the Year|2012|P
Duaa|Arijit Singh|Shanghai|2012|S
Phir Le Aaya Dil|Arijit Singh|Barfi!|2012|S
Ala Barfi|Mohit Chauhan|Barfi!|2012|P
Main Kya Karoon|Nikhil Paul George|Barfi!|2012|R
Kyon|Papon|Barfi!|2012|R
Aashiyan|Shreya Ghoshal|Barfi!|2012|R
Saans|Shreya Ghoshal|Jab Tak Hai Jaan|2012|R
Challa|Rabbi Shergill|Jab Tak Hai Jaan|2012|K
Ishq Shava|Shilpa Rao|Jab Tak Hai Jaan|2012|P
Jiya Re|Neeti Mohan|Jab Tak Hai Jaan|2012|M
Heer|Harshdeep Kaur|Jab Tak Hai Jaan|2012|U
Hookah Bar|Himesh Reshammiya|Khiladi 786|2012|P
Pani Da Rang|Ayushmann Khurrana|Vicky Donor|2012|S
Tujhe Sochta Hoon|KK|Jannat 2|2012|R
Tum Hi Ho|Arijit Singh|Aashiqui 2|2013|R S
Sun Raha Hai|Ankit Tiwari|Aashiqui 2|2013|S
Chahun Main Ya Naa|Arijit Singh|Aashiqui 2|2013|R
Bhula Dena|Mustafa Zahid|Aashiqui 2|2013|S
Milne Hai Mujhse Aayi|Arijit Singh|Aashiqui 2|2013|S
Hum Mar Jayenge|Arijit Singh|Aashiqui 2|2013|R
Piya Aaye Na|KK|Aashiqui 2|2013|R
Kabira|Tochi Raina|Yeh Jawaani Hai Deewani|2013|U
Badtameez Dil|Benny Dayal|Yeh Jawaani Hai Deewani|2013|P
Balam Pichkari|Vishal Dadlani|Yeh Jawaani Hai Deewani|2013|P
Ilahi|Arijit Singh|Yeh Jawaani Hai Deewani|2013|M
Dilliwaali Girlfriend|Arijit Singh|Yeh Jawaani Hai Deewani|2013|P
Subhanallah|Sreeram Chandra|Yeh Jawaani Hai Deewani|2013|R
Ghagra|Vishal Dadlani|Yeh Jawaani Hai Deewani|2013|P
Nagada Sang Dhol|Shreya Ghoshal|Goliyon Ki Raasleela Ram-Leela|2013|P
Tattad Tattad|Aditya Narayan|Goliyon Ki Raasleela Ram-Leela|2013|P
Lahu Munh Lag Gaya|Shail Hada|Goliyon Ki Raasleela Ram-Leela|2013|R
Ang Laga De|Aditya Narayan|Goliyon Ki Raasleela Ram-Leela|2013|R
Ram Chahe Leela|Bhoomi Trivedi|Goliyon Ki Raasleela Ram-Leela|2013|P
Laal Ishq|Arijit Singh|Goliyon Ki Raasleela Ram-Leela|2013|S
Zinda|Siddharth Mahadevan|Bhaag Milkha Bhaag|2013|M
Maston Ka Jhund|Divya Kumar|Bhaag Milkha Bhaag|2013|P
O Rangrez|Javed Bashir|Bhaag Milkha Bhaag|2013|U
Lungi Dance|Yo Yo Honey Singh|Chennai Express|2013|P
Titli|Chinmayi|Chennai Express|2013|R
Kashmir Main Tu Kanyakumari|Sunidhi Chauhan|Chennai Express|2013|P
1234 Get On The Dance Floor|Vishal Dadlani|Chennai Express|2013|P
Blue Eyes|Yo Yo Honey Singh|Blue Eyes|2013|P H
Party All Night|Yo Yo Honey Singh|Boss|2013|P
Raanjhanaa|A.R. Rahman|Raanjhanaa|2013|R
Tum Tak|Javed Ali|Raanjhanaa|2013|R
Banarasiya|Shreya Ghoshal|Raanjhanaa|2013|P
Kaun Mera|Sunidhi Chauhan|Special 26|2013|R
Kabhi Jo Badal Barse|Arijit Singh|Jackpot|2013|R
Jeene Laga Hoon|Atif Aslam|Ramaiya Vastavaiya|2013|R
Teri Jhuki Nazar|Shafqat Amanat Ali|Murder 3|2013|R
Mat Azma Re|KK|Murder 3|2013|R
Kaise Bataaun|KK|3G|2013|R
Mann Mera|Gajendra Verma|Table No. 21|2013|R
Tune Maari Entriyaan|Neeti Mohan|Gunday|2014|P
Jashn-e-Ishqa|Javed Ali|Gunday|2014|P
Jiya|Arijit Singh|Gunday|2014|R
Asalaam-e-Ishqum|Neha Bhasin|Gunday|2014|P
Galliyan|Ankit Tiwari|Ek Villain|2014|R
Banjaara|Mohammed Irfan|Ek Villain|2014|R
Hamdard|Arijit Singh|Ek Villain|2014|S
Zaroori Tha|Rahat Fateh Ali Khan|Back 2 Love|2014|S
Samjhawan|Arijit Singh|Humpty Sharma Ki Dulhania|2014|R
Saturday Saturday|Badshah|Humpty Sharma Ki Dulhania|2014|P
Abhi Toh Party Shuru Hui Hai|Badshah|Khoobsurat|2014|P H
Galat Baat Hai|Javed Ali|Main Tera Hero|2014|P
Sunny Sunny|Yo Yo Honey Singh|Yaariyan|2014|P
ABCD|Yo Yo Honey Singh|Yaariyan|2014|P
Baarish|Mohammed Irfan|Yaariyan|2014|R
Love Dose|Yo Yo Honey Singh|Desi Kalakaar|2014|P
Chaar Botal Vodka|Yo Yo Honey Singh|Ragini MMS 2|2014|P
Baby Doll|Kanika Kapoor|Ragini MMS 2|2014|P
Lovely|Kanika Kapoor|Happy New Year|2014|P
Manwa Laage|Arijit Singh|Happy New Year|2014|R
India Waale|Vishal Dadlani|Happy New Year|2014|M
Muskurane|Arijit Singh|CityLights|2014|R
Mareez-E-Ishq|Arijit Singh|Zid|2014|S
Mast Magan|Arijit Singh|2 States|2014|R
Locha-E-Ulfat|Benny Dayal|2 States|2014|P
London Thumakda|Labh Janjua|Queen|2014|P
Badra Bahaar|Amit Trivedi|Queen|2014|K
Ishq Bulaava|Sanam Puri|Hasee Toh Phasee|2014|R
Drama Queen|Vishal Dadlani|Hasee Toh Phasee|2014|P
Zehnaseeb|Chinmayi|Hasee Toh Phasee|2014|R
Aata Majhi Satakli|Sukhwinder Singh|Singham Returns|2014|P
Hai Dil Ye Mera|Arijit Singh|Hate Story 2|2014|R
Dard Dilo Ke|Mohammed Irfan|The Xposé|2014|S
Mitti Di Khushboo|Ayushmann Khurrana|Mitti Di Khushboo|2014|R
Channa Mereya|Arijit Singh|Ae Dil Hai Mushkil|2016|S
Ae Dil Hai Mushkil|Arijit Singh|Ae Dil Hai Mushkil|2016|S
Bulleya|Amit Mishra|Ae Dil Hai Mushkil|2016|U
Breakup Song|Arijit Singh|Ae Dil Hai Mushkil|2016|P
Cutiepie|Pardeep Singh Sran|Ae Dil Hai Mushkil|2016|P
Agar Tum Saath Ho|Alka Yagnik|Tamasha|2015|S
Matargashti|Mohit Chauhan|Tamasha|2015|P
Safarnama|Lucky Ali|Tamasha|2015|M
Heer Toh Badi Sad Hai|Mika Singh|Tamasha|2015|P
Selfie Le Le Re|Vishal Dadlani|Bajrangi Bhaijaan|2015|P
Tu Jo Mila|KK|Bajrangi Bhaijaan|2015|R
Tu Chahiye|Atif Aslam|Bajrangi Bhaijaan|2015|R
Bhar Do Jholi Meri|Adnan Sami|Bajrangi Bhaijaan|2015|U
Prem Ratan Dhan Payo|Palak Muchhal|Prem Ratan Dhan Payo|2015|R
Gerua|Arijit Singh|Dilwale|2015|R
Janam Janam|Arijit Singh|Dilwale|2015|R
Manma Emotion Jaage|Amit Mishra|Dilwale|2015|P
Tukur Tukur|Arijit Singh|Dilwale|2015|P
Deewani Mastani|Shreya Ghoshal|Bajirao Mastani|2015|R
Pinga|Shreya Ghoshal|Bajirao Mastani|2015|P
Malhari|Vishal Dadlani|Bajirao Mastani|2015|P
Aayat|Arijit Singh|Bajirao Mastani|2015|U
Mohe Rang Do Laal|Pandit Birju Maharaj|Bajirao Mastani|2015|U
Hamari Adhuri Kahani|Arijit Singh|Hamari Adhuri Kahani|2015|S
Humnava|Papon|Hamari Adhuri Kahani|2015|R
Hasi|Ami Mishra|Hamari Adhuri Kahani|2015|S
Sooraj Dooba Hain|Arijit Singh|Roy|2015|P
Tu Hai Ki Nahi|Ankit Tiwari|Roy|2015|S
Boond Boond|Ankit Tiwari|Roy|2015|R
Sun Saathiya|Priya Saraiya|ABCD 2|2015|R
Bezubaan Phir Se|Vishal Dadlani|ABCD 2|2015|M
Chunar|Arijit Singh|ABCD 2|2015|S
Gallan Goodiyaan|Yashita Sharma|Dil Dhadakne Do|2015|P
Pehli Baar|Siddharth Mahadevan|Dil Dhadakne Do|2015|R
Girls Like To Swing|Sunidhi Chauhan|Dil Dhadakne Do|2015|P
Tu Kisi Rail Si Guzarti Hai|Swanand Kirkire|Masaan|2015|C
Moh Moh Ke Dhaage|Papon|Dum Laga Ke Haisha|2015|R
Wajah Tum Ho|Armaan Malik|Hate Story 3|2015|R
Main Rahoon Ya Na Rahoon|Armaan Malik|Main Rahoon Ya Na Rahoon|2015|S
DJ Waley Babu|Badshah|DJ Waley Babu|2015|P H
Dheere Dheere|Yo Yo Honey Singh|Dheere Dheere|2015|R
Wakhra Swag|Navv Inder|Wakhra Swag|2015|P J
Judaai|Arijit Singh|Badlapur|2015|S
Jeena Jeena|Atif Aslam|Badlapur|2015|R
Jee Karda|Divya Kumar|Badlapur|2015|P
Sapna Jahan|Sonu Nigam|Brothers|2015|R
Main Hoon Hero Tera|Salman Khan|Hero|2015|R
Tu Har Lamha|Arijit Singh|Khamoshiyan|2015|R
Khamoshiyan|Arijit Singh|Khamoshiyan|2015|S
Baatein Ye Kabhi Na|Arijit Singh|Khamoshiyan|2015|R
Chal Wahan Jaate Hain|Arijit Singh|Chal Wahan Jaate Hain|2015|R
Choo Lo|The Local Train|Aalas Ka Pedh|2015|K
Aaoge Tum Kabhi|The Local Train|Aalas Ka Pedh|2015|K
Tum Jab Paas|Prateek Kuhad|Tum Jab Paas|2015|C
Tajdar-e-Haram|Atif Aslam|Coke Studio|2015|U
Jag Ghoomeya|Rahat Fateh Ali Khan|Sultan|2016|R
Baby Ko Bass Pasand Hai|Vishal Dadlani|Sultan|2016|P
Sultan|Sukhwinder Singh|Sultan|2016|M
Sanam Re|Arijit Singh|Sanam Re|2016|R
Sanam Teri Kasam|Ankit Tiwari|Sanam Teri Kasam|2016|S
Kaun Tujhe|Palak Muchhal|M.S. Dhoni: The Untold Story|2016|R
Besabriyaan|Armaan Malik|M.S. Dhoni: The Untold Story|2016|M
Jab Tak|Armaan Malik|M.S. Dhoni: The Untold Story|2016|R
Phir Kabhi|Arijit Singh|M.S. Dhoni: The Untold Story|2016|R
Bol Do Na Zara|Armaan Malik|Azhar|2016|R
Itni Si Baat Hain|Arijit Singh|Azhar|2016|R
Naina|Arijit Singh|Dangal|2016|S
Dangal|Daler Mehndi|Dangal|2016|M
Haanikaarak Bapu|Sarwar Khan|Dangal|2016|P
Dhaakad|Raftaar|Dangal|2016|H
Gilehriyaan|Jonita Gandhi|Dangal|2016|R
Kar Gayi Chull|Badshah|Kapoor & Sons|2016|P H
Bolna|Arijit Singh|Kapoor & Sons|2016|R
Buddhu Sa Mann|Armaan Malik|Kapoor & Sons|2016|R
Kala Chashma|Badshah|Baar Baar Dekho|2016|P J
Sau Aasmaan|Armaan Malik|Baar Baar Dekho|2016|R
Nachde Ne Saare|Jasleen Royal|Baar Baar Dekho|2016|P
Kho Gaye Hum Kahan|Prateek Kuhad|Baar Baar Dekho|2016|C
Nashe Si Chadh Gayi|Arijit Singh|Befikre|2016|P
Labon Ka Karobaar|Papon|Befikre|2016|R
Ude Dil Befikre|Benny Dayal|Befikre|2016|P
Soch Na Sake|Arijit Singh|Airlift|2016|R
Pashmina|Amit Trivedi|Fitoor|2016|R
Tere Sang Yaara|Atif Aslam|Rustom|2016|R
Kuch Toh Hai|Armaan Malik|Do Lafzon Ki Kahani|2016|R
Mile Ho Tum|Neha Kakkar|Fever|2016|R
Do You Know|Diljit Dosanjh|Do You Know|2016|R J
Laembadgini|Diljit Dosanjh|Laembadgini|2016|P J
Swag Se Swagat|Vishal Dadlani|Tiger Zinda Hai|2017|P
Dil Diyan Gallan|Atif Aslam|Tiger Zinda Hai|2017|R
Phir Bhi Tumko Chaahunga|Arijit Singh|Half Girlfriend|2017|R
Baarish|Ash King|Half Girlfriend|2017|R
Thodi Der|Farhan Saeed|Half Girlfriend|2017|R
Hawayein|Arijit Singh|Jab Harry Met Sejal|2017|R
Radha|Sunidhi Chauhan|Jab Harry Met Sejal|2017|P
Safar|Arijit Singh|Jab Harry Met Sejal|2017|M
Tamma Tamma Again|Badshah|Badrinath Ki Dulhania|2017|P
Badri Ki Dulhania|Dev Negi|Badrinath Ki Dulhania|2017|P
Roke Na Ruke Naina|Arijit Singh|Badrinath Ki Dulhania|2017|R
Chalti Hai Kya 9 Se 12|Dev Negi|Judwaa 2|2017|P
The Humma Song|Badshah|OK Jaanu|2017|P
Enna Sona|Arijit Singh|OK Jaanu|2017|R
Mere Rashke Qamar|Nusrat Fateh Ali Khan|Baadshaho|2017|U
Ik Vaari Aa|Arijit Singh|Raabta|2017|R
Main Tera Boyfriend|Arijit Singh|Raabta|2017|P
Darasal|Atif Aslam|Raabta|2017|R
Laila Main Laila|Pawni Pandey|Raees|2017|P
Zaalima|Arijit Singh|Raees|2017|R
Udi Udi Jaye|Sukhwinder Singh|Raees|2017|P
Nazm Nazm|Arko|Bareilly Ki Barfi|2017|R
Sweety Tera Drama|Dev Negi|Bareilly Ki Barfi|2017|P
Galti Se Mistake|Arijit Singh|Jagga Jasoos|2017|P
Ullu Ka Pattha|Arijit Singh|Jagga Jasoos|2017|P
Suit Suit|Guru Randhawa|Hindi Medium|2017|P J
Ban Ja Rani|Guru Randhawa|Tumhari Sulu|2017|R J
High Rated Gabru|Guru Randhawa|High Rated Gabru|2017|P J
Lahore|Guru Randhawa|Lahore|2017|P J
Naah|Harrdy Sandhu|Naah|2017|P J
Backbone|Harrdy Sandhu|Backbone|2017|P J
Pehli Dafa|Atif Aslam|Pehli Dafa|2017|R
Mercy|Badshah|Mercy|2017|P
Ghoomar|Shreya Ghoshal|Padmaavat|2018|P
Khalibali|Shivam Pathak|Padmaavat|2018|P
Binte Dil|Arijit Singh|Padmaavat|2018|U
Ek Dil Ek Jaan|Shivam Pathak|Padmaavat|2018|R
Dilbar|Neha Kakkar|Satyameva Jayate|2018|P
Aankh Marey|Neha Kakkar|Simmba|2018|P
Tere Bin|Rahat Fateh Ali Khan|Simmba|2018|R
Tera Yaar Hoon Main|Arijit Singh|Sonu Ke Titu Ki Sweety|2018|M
Dil Chori|Yo Yo Honey Singh|Sonu Ke Titu Ki Sweety|2018|P
Bom Diggy Diggy|Zack Knight|Sonu Ke Titu Ki Sweety|2018|P
Kamariya|Aastha Gill|Stree|2018|P
Milegi Milegi|Mika Singh|Stree|2018|P
Kar Har Maidaan Fateh|Sukhwinder Singh|Sanju|2018|M
Main Badhiya Tu Bhi Badhiya|Sonu Nigam|Sanju|2018|P
Ruby Ruby|Shashwat Singh|Sanju|2018|P
Sweetheart|Dev Negi|Kedarnath|2018|P
Namo Namo|Amit Trivedi|Kedarnath|2018|U
Qaafirana|Arijit Singh|Kedarnath|2018|R
Tera Fitoor|Arijit Singh|Genius|2018|R
Dil Meri Na Sune|Atif Aslam|Genius|2018|R
Mere Naam Tu|Abhay Jodhpurkar|Zero|2018|R
Husn Parcham|Bhoomi Trivedi|Zero|2018|P
Bandeya|Arijit Singh|Dil Juunglee|2018|R
Aaj Se Teri|Arijit Singh|Pad Man|2018|R
Lae Dooba|Sunidhi Chauhan|Aiyaary|2018|R
Sanu Ek Pal Chain|Rahat Fateh Ali Khan|Raid|2018|U
Nit Khair Manga|Rahat Fateh Ali Khan|Raid|2018|U
Dekhte Dekhte|Atif Aslam|Batti Gul Meter Chalu|2018|S
Gali Gali|Neha Kakkar|KGF Chapter 1|2018|P
Chogada|Darshan Raval|Loveyatri|2018|P
Proper Patola|Diljit Dosanjh|Namaste England|2018|P J
Patola|Guru Randhawa|Blackmail|2018|P J
Made In India|Guru Randhawa|Made In India|2018|P
Ishare Tere|Guru Randhawa|Ishare Tere|2018|R J
Kya Baat Ay|Harrdy Sandhu|Kya Baat Ay|2018|P J
Lamberghini|The Doorbeen|Lamberghini|2018|P J
She Move It Like|Badshah|She Move It Like|2018|P
Tera Ghata|Gajendra Verma|Tera Ghata|2018|S
O Humsafar|Neha Kakkar|O Humsafar|2018|R
Leja Re|Dhvani Bhanushali|Leja Re|2018|R
Humnava Mere|Jubin Nautiyal|Humnava Mere|2018|R
Riha|Anuv Jain|Riha|2018|C
Dil Mere|The Local Train|Vaaqif|2018|K
Tera Ban Jaunga|Akhil Sachdeva|Kabir Singh|2019|R
Bekhayali|Sachet Tandon|Kabir Singh|2019|S
Kaise Hua|Vishal Mishra|Kabir Singh|2019|R
Mere Sohneya|Sachet Tandon|Kabir Singh|2019|R
Tujhe Kitna Chahne Lage|Arijit Singh|Kabir Singh|2019|S
Pehla Pyaar|Armaan Malik|Kabir Singh|2019|R
Yeh Aaina|Shreya Ghoshal|Kabir Singh|2019|R
Ghungroo|Arijit Singh|War|2019|P
Jai Jai Shivshankar|Vishal Dadlani|War|2019|P
Khairiyat|Arijit Singh|Chhichhore|2019|S
Fikar Not|Nakash Aziz|Chhichhore|2019|P
Kalank|Arijit Singh|Kalank|2019|S
Ghar More Pardesiya|Shreya Ghoshal|Kalank|2019|U
First Class|Arijit Singh|Kalank|2019|P
Tabaah Ho Gaye|Shreya Ghoshal|Kalank|2019|S
Ve Maahi|Arijit Singh|Kesari|2019|R
Teri Mitti|B Praak|Kesari|2019|M S
Apna Time Aayega|Ranveer Singh|Gully Boy|2019|H
Mere Gully Mein|DIVINE|Gully Boy|2019|H
Doori|Ranveer Singh|Gully Boy|2019|H
Azadi|DIVINE|Gully Boy|2019|H
Coca Cola|Neha Kakkar|Luka Chuppi|2019|P
Poster Lagwa Do|Mika Singh|Luka Chuppi|2019|P
Duniyaa|Akhil|Luka Chuppi|2019|R
O Saki Saki|Neha Kakkar|Batla House|2019|P
Aithey Aa|Akasa Singh|Bharat|2019|P
Slow Motion|Nakash Aziz|Bharat|2019|P
Chashni|Abhijeet Srivastava|Bharat|2019|R
Ek Toh Kum Zindagani|Neha Kakkar|Marjaavaan|2019|P
Tum Hi Aana|Jubin Nautiyal|Marjaavaan|2019|S
Mungda|Jyotica Tangri|Total Dhamaal|2019|P
Tu Hi Yaar Mera|Arijit Singh|Pati Patni Aur Woh|2019|R
Dheeme Dheeme|Tony Kakkar|Pati Patni Aur Woh|2019|P
Dil Mein Ho Tum|Armaan Malik|Why Cheat India|2019|R
Makhna|Yasser Desai|Drive|2019|R
Pachtaoge|Arijit Singh|Pachtaoge|2019|S
Vaaste|Dhvani Bhanushali|Vaaste|2019|R
Filhall|B Praak|Filhall|2019|S J
Baari|Bilal Saeed|Baari|2019|R
Hawa Banke|Darshan Raval|Hawa Banke|2019|R
Lehanga|Jass Manak|Lehanga|2019|J P
Baarishein|Anuv Jain|Baarishein|2019|C
Shayad|Arijit Singh|Love Aaj Kal|2020|R
Haan Main Galat|Arijit Singh|Love Aaj Kal|2020|P
Garmi|Badshah|Street Dancer 3D|2020|P
Muqabla|Yash Narvekar|Street Dancer 3D|2020|P
Illegal Weapon 2.0|Jasmine Sandlas|Street Dancer 3D|2020|P J
Lagdi Lahore Di|Guru Randhawa|Street Dancer 3D|2020|P J
Malang|Ved Sharma|Malang|2020|P
Chal Ghar Chalen|Arijit Singh|Malang|2020|S
Kudi Nu Nachne De|Vishal Dadlani|Angrezi Medium|2020|P
Dil Ko Karaar Aaya|Yasser Desai|Dil Ko Karaar Aaya|2020|R
Kya Loge Tum|B Praak|Kya Loge Tum|2020|S
Ek Tarfa|Darshan Raval|Ek Tarfa|2020|S
Genda Phool|Badshah|Genda Phool|2020|P
Gul|Anuv Jain|Gul|2020|C
Alag Aasmaan|Anuv Jain|Alag Aasmaan|2020|C
Kasoor|Prateek Kuhad|The Way That Lovers Do|2020|C
Tu Aake Dekhle|King|The Carnival|2020|H
G.O.A.T.|Diljit Dosanjh|G.O.A.T.|2020|J H
Born To Shine|Diljit Dosanjh|G.O.A.T.|2020|J
Excuses|AP Dhillon|Excuses|2020|J
Brown Munde|AP Dhillon|Brown Munde|2020|J H
Daku|Inderpal Moga|Daku|2020|J
Ranjha|B Praak|Shershaah|2021|R
Raataan Lambiyan|Jubin Nautiyal|Shershaah|2021|R
Mann Bharryaa 2.0|B Praak|Shershaah|2021|S
Kabhi Tumhe|Darshan Raval|Shershaah|2021|R
Lut Gaye|Jubin Nautiyal|Lut Gaye|2021|R
Filhaal2 Mohabbat|B Praak|Filhaal2 Mohabbat|2021|S
Lehra Do|Arijit Singh|83|2021|M
Param Sundari|Shreya Ghoshal|Mimi|2021|P
Srivalli|Javed Ali|Pushpa: The Rise|2021|R
Oo Bolega Ya Oo Oo Bolega|Kanika Kapoor|Pushpa: The Rise|2021|P
Saami Saami|Sunidhi Chauhan|Pushpa: The Rise|2021|P
Mere Yaaraa|Arijit Singh|Sooryavanshi|2021|R
Rait Zara Si|Arijit Singh|Atrangi Re|2021|R
Chaka Chak|Shreya Ghoshal|Atrangi Re|2021|P
Asal Mein|Darshan Raval|Asal Mein|2021|S
Bijlee Bijlee|Harrdy Sandhu|Bijlee Bijlee|2021|P J
Jugnu|Badshah|Jugnu|2021|P
Paani Paani|Badshah|Paani Paani|2021|P
Lover|Diljit Dosanjh|MoonChild Era|2021|R J
Insane|AP Dhillon|Insane|2021|J
Kesariya|Arijit Singh|Brahmastra|2022|R
Deva Deva|Arijit Singh|Brahmastra|2022|U
Dance Ka Bhoot|Arijit Singh|Brahmastra|2022|P
Apna Bana Le|Arijit Singh|Bhediya|2022|R
Thumkeshwari|Rashmeet Kaur|Bhediya|2022|P
Tere Hawaale|Arijit Singh|Laal Singh Chaddha|2022|R
Kahani|Mohan Kannan|Laal Singh Chaddha|2022|C
Maan Meri Jaan|King|Champagne Talk|2022|R
Pasoori|Ali Sethi|Coke Studio|2022|P U
Kahani Suno 2.0|Kaifi Khalil|Kahani Suno 2.0|2022|S
Chaand Baaliyan|Aditya A|Chaand Baaliyan|2022|C
Summer High|AP Dhillon|Summer High|2022|J
Pehle Bhi Main|Vishal Mishra|Animal|2023|R
Arjan Vailly|Bhupinder Babbal|Animal|2023|P J
Satranga|Arijit Singh|Animal|2023|S
Hua Main|Raghav Chaitanya|Animal|2023|R
Papa Meri Jaan|Sonu Nigam|Animal|2023|S
Chaleya|Arijit Singh|Jawan|2023|R
Zinda Banda|Anirudh Ravichander|Jawan|2023|P
Not Ramaiya Vastavaiya|Anirudh Ravichander|Jawan|2023|P
Jhoome Jo Pathaan|Arijit Singh|Pathaan|2023|P
Besharam Rang|Shilpa Rao|Pathaan|2023|P
Tere Vaaste|Varun Jain|Zara Hatke Zara Bachke|2023|R
Phir Aur Kya Chahiye|Arijit Singh|Zara Hatke Zara Bachke|2023|R
Tum Kya Mile|Arijit Singh|Rocky Aur Rani Kii Prem Kahaani|2023|R
What Jhumka?|Arijit Singh|Rocky Aur Rani Kii Prem Kahaani|2023|P
Ve Kamleya|Arijit Singh|Rocky Aur Rani Kii Prem Kahaani|2023|R
Heeriye|Jasleen Royal|Heeriye|2023|R
O Maahi|Arijit Singh|Dunki|2023|R
Lutt Putt Gaya|Arijit Singh|Dunki|2023|P
Nikle The Kabhi Hum Ghar Se|Sonu Nigam|Dunki|2023|S
Tere Pyaar Mein|Arijit Singh|Tu Jhoothi Main Makkaar|2023|R
Show Me The Thumka|Shashwat Singh|Tu Jhoothi Main Makkaar|2023|P
O Bedardeya|Arijit Singh|Tu Jhoothi Main Makkaar|2023|S
Chal Tere Ishq Mein|Neeti Mohan|Gadar 2|2023|R
Zihaal e Miskin|Vishal Mishra|Zihaal e Miskin|2023|R
Husn|Anuv Jain|Husn|2023|C S
Maand|Bayaan|Maand|2023|C
Players|Badshah|Players|2023|P H
With You|AP Dhillon|With You|2023|J R
Dil Nu|AP Dhillon|Dil Nu|2023|J
Softly|Karan Aujla|Making Memories|2023|J
Admirin' You|Karan Aujla|Making Memories|2023|J R
Tu Jhoom|Abida Parveen|Coke Studio|2023|U
Tum Se|Raghav Chaitanya|Teri Baaton Mein Aisa Uljha Jiya|2024|R
Akhiyaan Gulaab|Mitraz|Teri Baaton Mein Aisa Uljha Jiya|2024|P
Aaj Ki Raat|Madhubanti Bagchi|Stree 2|2024|P
Aayi Nai|Pawan Singh|Stree 2|2024|P
Tumhare Hi Rahenge Hum|Varun Jain|Stree 2|2024|R
Sajni|Arijit Singh|Laapataa Ladies|2024|S
Tauba Tauba|Karan Aujla|Bad Newz|2024|P J
Naina|Diljit Dosanjh|Crew|2024|P J
Mere Dholna 3.0|Shreya Ghoshal|Bhool Bhulaiyaa 3|2024|U
Mast Malang Jhoom|Arijit Singh|Bade Miyan Chote Miyan|2024|P
Ishq Jaisa Kuch|Vishal Dadlani|Fighter|2024|R
Sher Khul Gaye|Vishal Dadlani|Fighter|2024|P
Angaaron|Shreya Ghoshal|Pushpa 2: The Rule|2024|R
Raanjhan|Parampara Tandon|Do Patti|2024|R
Sahiba|Aditya Rikhari|Sahiba|2024|R
Faasle|Aditya Rikhari|Faasle|2024|C
Jo Tum Mere Ho|Anuv Jain|Jo Tum Mere Ho|2024|C R
Afsos|Anuv Jain|Afsos|2024|C
Bairan|Banjaare|Bairan|2024|C
Wavy|Karan Aujla|Wavy|2024|J
Saiyaara|Faheem Abdullah|Saiyaara|2025|R
Barbaad|Jubin Nautiyal|Saiyaara|2025|S
Tum Ho Toh|Vishal Mishra|Saiyaara|2025|R
Humsafar|Sachet Tandon|Saiyaara|2025|R
Dhun|Arijit Singh|Saiyaara|2025|R
Jaane Tu|Arijit Singh|Chhaava|2025|S

## en
Shape of You|Ed Sheeran|÷|2017|O P
Perfect|Ed Sheeran|÷|2017|R
Castle on the Hill|Ed Sheeran|÷|2017|O
Thinking Out Loud|Ed Sheeran|x|2014|R
Photograph|Ed Sheeran|x|2014|R
Bad Habits|Ed Sheeran|=|2021|P
Shivers|Ed Sheeran|=|2021|P
The A Team|Ed Sheeran|+|2011|S
Blinding Lights|The Weeknd|After Hours|2019|P O
Save Your Tears|The Weeknd|After Hours|2020|O
Starboy|The Weeknd|Starboy|2016|P
Die For You|The Weeknd|Starboy|2016|N
I Feel It Coming|The Weeknd|Starboy|2016|O
The Hills|The Weeknd|Beauty Behind the Madness|2015|N
Can't Feel My Face|The Weeknd|Beauty Behind the Madness|2015|O
Levitating|Dua Lipa|Future Nostalgia|2020|P
Don't Start Now|Dua Lipa|Future Nostalgia|2019|P
New Rules|Dua Lipa|Dua Lipa|2017|O
Houdini|Dua Lipa|Radical Optimism|2023|P
As It Was|Harry Styles|Harry's House|2022|O
Watermelon Sugar|Harry Styles|Fine Line|2019|O
Adore You|Harry Styles|Fine Line|2019|O
Sign of the Times|Harry Styles|Harry Styles|2017|O S
Anti-Hero|Taylor Swift|Midnights|2022|O
Cruel Summer|Taylor Swift|Lover|2019|O
Lover|Taylor Swift|Lover|2019|R
Shake It Off|Taylor Swift|1989|2014|O P
Blank Space|Taylor Swift|1989|2014|O
Style|Taylor Swift|1989|2014|O
Love Story|Taylor Swift|Fearless|2008|R
You Belong With Me|Taylor Swift|Fearless|2008|O
Bad Guy|Billie Eilish|When We All Fall Asleep, Where Do We Go?|2019|O
Lovely|Billie Eilish|Lovely|2018|S
Ocean Eyes|Billie Eilish|Ocean Eyes|2016|C
Happier Than Ever|Billie Eilish|Happier Than Ever|2021|S K
What Was I Made For?|Billie Eilish|Barbie The Album|2023|S
Birds of a Feather|Billie Eilish|Hit Me Hard and Soft|2024|R
Someone Like You|Adele|21|2011|S
Rolling in the Deep|Adele|21|2010|O
Set Fire to the Rain|Adele|21|2011|S
Hello|Adele|25|2015|S
Skyfall|Adele|Skyfall|2012|S
Easy On Me|Adele|30|2021|S
Baby|Justin Bieber|My World 2.0|2010|O
Sorry|Justin Bieber|Purpose|2015|P
Love Yourself|Justin Bieber|Purpose|2015|O
What Do You Mean?|Justin Bieber|Purpose|2015|O
Peaches|Justin Bieber|Justice|2021|N
Ghost|Justin Bieber|Justice|2021|S
Stay|The Kid LAROI|F*ck Love 3|2021|O
Uptown Funk|Mark Ronson|Uptown Special|2014|P
Just the Way You Are|Bruno Mars|Doo-Wops & Hooligans|2010|R
Grenade|Bruno Mars|Doo-Wops & Hooligans|2010|S
Talking to the Moon|Bruno Mars|Doo-Wops & Hooligans|2010|S
Locked Out of Heaven|Bruno Mars|Unorthodox Jukebox|2012|O
When I Was Your Man|Bruno Mars|Unorthodox Jukebox|2012|S
24K Magic|Bruno Mars|24K Magic|2016|P
That's What I Like|Bruno Mars|24K Magic|2016|N
Die With A Smile|Lady Gaga|Die With A Smile|2024|R
APT.|ROSÉ|rosie|2024|P
Poker Face|Lady Gaga|The Fame|2008|P
Just Dance|Lady Gaga|The Fame|2008|P
Bad Romance|Lady Gaga|The Fame Monster|2009|P
Shallow|Lady Gaga|A Star Is Born|2018|R
Hot N Cold|Katy Perry|One of the Boys|2008|O
Firework|Katy Perry|Teenage Dream|2010|O M
California Gurls|Katy Perry|Teenage Dream|2010|P
Roar|Katy Perry|Prism|2013|M
Dark Horse|Katy Perry|Prism|2013|O
Umbrella|Rihanna|Good Girl Gone Bad|2007|O
Only Girl (In the World)|Rihanna|Loud|2010|P
We Found Love|Rihanna|Talk That Talk|2011|P
Diamonds|Rihanna|Unapologetic|2012|O
Work|Rihanna|Anti|2016|N
Love The Way You Lie|Eminem|Recovery|2010|H
Lose Yourself|Eminem|8 Mile|2002|H M
Without Me|Eminem|The Eminem Show|2002|H
Till I Collapse|Eminem|The Eminem Show|2002|H M
Mockingbird|Eminem|Encore|2004|H S
The Real Slim Shady|Eminem|The Marshall Mathers LP|2000|H
Stan|Eminem|The Marshall Mathers LP|2000|H
Rap God|Eminem|The Marshall Mathers LP2|2013|H
Godzilla|Eminem|Music To Be Murdered By|2020|H
In Da Club|50 Cent|Get Rich Or Die Tryin'|2003|H P
Candy Shop|50 Cent|The Massacre|2005|H
Gangsta's Paradise|Coolio|Gangsta's Paradise|1995|H
Hotline Bling|Drake|Views|2016|H
One Dance|Drake|Views|2016|P
God's Plan|Drake|Scorpion|2018|H
In My Feelings|Drake|Scorpion|2018|H
SICKO MODE|Travis Scott|ASTROWORLD|2018|H
goosebumps|Travis Scott|Birds in the Trap Sing McKnight|2016|H
HUMBLE.|Kendrick Lamar|DAMN.|2017|H
Money Trees|Kendrick Lamar|good kid, m.A.A.d city|2012|H
Not Like Us|Kendrick Lamar|Not Like Us|2024|H
Stronger|Kanye West|Graduation|2007|H
Heartless|Kanye West|808s & Heartbreak|2008|H
Gold Digger|Kanye West|Late Registration|2005|H
Empire State Of Mind|JAY-Z|The Blueprint 3|2009|H
rockstar|Post Malone|beerbongs & bentleys|2017|H
Better Now|Post Malone|beerbongs & bentleys|2018|O
Circles|Post Malone|Hollywood's Bleeding|2019|O
Sunflower|Post Malone|Spider-Man: Into the Spider-Verse|2018|O
Congratulations|Post Malone|Stoney|2016|H
See You Again|Wiz Khalifa|Furious 7|2015|H S
Old Town Road|Lil Nas X|7|2019|H
INDUSTRY BABY|Lil Nas X|MONTERO|2021|H
Lucid Dreams|Juice WRLD|Goodbye & Good Riddance|2018|H S
Mask Off|Future|FUTURE|2017|H
XO Tour Llif3|Lil Uzi Vert|Luv Is Rage 2|2017|H
Mood|24kGoldn|El Dorado|2020|H
Calm Down|Rema|Rave & Roses|2022|P
Unholy|Sam Smith|Gloria|2022|P
Stay With Me|Sam Smith|In The Lonely Hour|2014|S
Too Good At Goodbyes|Sam Smith|The Thrill Of It All|2017|S
Flowers|Miley Cyrus|Endless Summer Vacation|2023|O
Wrecking Ball|Miley Cyrus|Bangerz|2013|S
Party In The U.S.A.|Miley Cyrus|The Time Of Our Lives|2009|P
drivers license|Olivia Rodrigo|SOUR|2021|S
good 4 u|Olivia Rodrigo|SOUR|2021|K
vampire|Olivia Rodrigo|GUTS|2023|S
Espresso|Sabrina Carpenter|Short n' Sweet|2024|O
Please Please Please|Sabrina Carpenter|Short n' Sweet|2024|O
greedy|Tate McRae|THINK LATER|2023|P
Kill Bill|SZA|SOS|2022|N
Snooze|SZA|SOS|2022|N
Kiss Me More|Doja Cat|Planet Her|2021|P
Say So|Doja Cat|Hot Pink|2019|P
Paint The Town Red|Doja Cat|Scarlet|2023|H
Problem|Ariana Grande|My Everything|2014|P
Into You|Ariana Grande|Dangerous Woman|2016|P
thank u, next|Ariana Grande|thank u, next|2019|O
7 rings|Ariana Grande|thank u, next|2019|O
positions|Ariana Grande|Positions|2020|O
Señorita|Shawn Mendes|Señorita|2019|R
Treat You Better|Shawn Mendes|Illuminate|2016|O
There's Nothing Holdin' Me Back|Shawn Mendes|Illuminate|2017|O
Stitches|Shawn Mendes|Handwritten|2015|O
Attention|Charlie Puth|Voicenotes|2017|O
We Don't Talk Anymore|Charlie Puth|Nine Track Mind|2016|S
Let Me Love You|DJ Snake|Encore|2016|P
Lean On|Major Lazer|Peace Is The Mission|2015|P
Closer|The Chainsmokers|Collage|2016|P
Don't Let Me Down|The Chainsmokers|Collage|2016|P
Something Just Like This|The Chainsmokers|Memories...Do Not Open|2017|P
Faded|Alan Walker|Different World|2015|P
Alone|Alan Walker|Alone|2016|P
Wake Me Up|Avicii|True|2013|P
Levels|Avicii|Levels|2011|P
The Nights|Avicii|The Days / Nights|2014|P M
Titanium|David Guetta|Nothing But The Beat|2011|P
Animals|Martin Garrix|Animals|2013|P
In The Name Of Love|Martin Garrix|In The Name Of Love|2016|P
Feel So Close|Calvin Harris|18 Months|2011|P
Summer|Calvin Harris|Motion|2014|P
This Is What You Came For|Calvin Harris|This Is What You Came For|2016|P
One Kiss|Calvin Harris|One Kiss|2018|P
Don't You Worry Child|Swedish House Mafia|Until Now|2012|P
Get Lucky|Daft Punk|Random Access Memories|2013|P
Happy|Pharrell Williams|Despicable Me 2|2013|P
Chandelier|Sia|1000 Forms Of Fear|2014|O
Cheap Thrills|Sia|This Is Acting|2016|P
Unstoppable|Sia|This Is Acting|2016|M
Give Me Everything|Pitbull|Planet Pit|2011|P
Timber|Pitbull|Global Warming|2013|P
Apologize|OneRepublic|Dreaming Out Loud|2007|S
Counting Stars|OneRepublic|Native|2013|O
I Ain't Worried|OneRepublic|Top Gun: Maverick|2022|O
Radioactive|Imagine Dragons|Night Visions|2012|K
Demons|Imagine Dragons|Night Visions|2012|K
Believer|Imagine Dragons|Evolve|2017|K M
Thunder|Imagine Dragons|Evolve|2017|K
Natural|Imagine Dragons|Origins|2018|K M
Enemy|Imagine Dragons|Arcane League of Legends|2021|K
Bones|Imagine Dragons|Mercury - Act 2|2022|K
Yellow|Coldplay|Parachutes|2000|K R
The Scientist|Coldplay|A Rush of Blood to the Head|2002|S
Clocks|Coldplay|A Rush of Blood to the Head|2002|K
Fix You|Coldplay|X&Y|2005|S
Viva La Vida|Coldplay|Viva La Vida or Death and All His Friends|2008|K
Paradise|Coldplay|Mylo Xyloto|2011|K
A Sky Full of Stars|Coldplay|Ghost Stories|2014|P
Adventure of a Lifetime|Coldplay|A Head Full of Dreams|2015|P
Hymn for the Weekend|Coldplay|A Head Full of Dreams|2016|P
My Universe|Coldplay|Music Of The Spheres|2021|O
Mr. Brightside|The Killers|Hot Fuss|2004|K
Somebody That I Used To Know|Gotye|Making Mirrors|2011|S
Riptide|Vance Joy|Dream Your Life Away|2013|C
Let Her Go|Passenger|All the Little Lights|2012|S
Pompeii|Bastille|Bad Blood|2013|K
Take Me To Church|Hozier|Hozier|2013|K
Too Sweet|Hozier|Unheard|2024|K
Heat Waves|Glass Animals|Dreamland|2020|C
Sweater Weather|The Neighbourhood|I Love You.|2013|K
Another Love|Tom Odell|Long Way Down|2013|S
Arcade|Duncan Laurence|Small Town Boy|2019|S
Let Me Down Slowly|Alec Benjamin|Narrated For You|2018|S
Someone You Loved|Lewis Capaldi|Divinely Uninspired To A Hellish Extent|2019|S
Before You Go|Lewis Capaldi|Divinely Uninspired To A Hellish Extent|2019|S
All of Me|John Legend|Love In The Future|2013|R
Say You Won't Let Go|James Arthur|Back from the Edge|2016|R
Impossible|James Arthur|James Arthur|2012|S
A Thousand Years|Christina Perri|The Twilight Saga: Breaking Dawn|2011|R
Jar of Hearts|Christina Perri|lovestrong.|2010|S
Love Me Like You Do|Ellie Goulding|Fifty Shades of Grey|2015|R
Until I Found You|Stephen Sanchez|Easy On My Eyes|2022|R
What Makes You Beautiful|One Direction|Up All Night|2011|O
Story of My Life|One Direction|Midnight Memories|2013|O
Night Changes|One Direction|FOUR|2014|O
She Will Be Loved|Maroon 5|Songs About Jane|2002|S
Moves Like Jagger|Maroon 5|Hands All Over|2011|P
Payphone|Maroon 5|Overexposed|2012|O
Sugar|Maroon 5|V|2015|O
Girls Like You|Maroon 5|Red Pill Blues|2018|O
Memories|Maroon 5|JORDI|2019|O
Stressed Out|Twenty One Pilots|Blurryface|2015|K
Ride|Twenty One Pilots|Blurryface|2015|K
Heathens|Twenty One Pilots|Suicide Squad|2016|K
In the End|Linkin Park|Hybrid Theory|2000|K
Numb|Linkin Park|Meteora|2003|K
What I've Done|Linkin Park|Minutes to Midnight|2007|K
Boulevard of Broken Dreams|Green Day|American Idiot|2004|K
Wake Me Up When September Ends|Green Day|American Idiot|2004|S
Smells Like Teen Spirit|Nirvana|Nevermind|1991|K
Bohemian Rhapsody|Queen|A Night At The Opera|1975|K
We Will Rock You|Queen|News Of The World|1977|K
Don't Stop Me Now|Queen|Jazz|1978|K
Another One Bites The Dust|Queen|The Game|1980|K
Hotel California|Eagles|Hotel California|1976|K
Sweet Child O' Mine|Guns N' Roses|Appetite For Destruction|1987|K
November Rain|Guns N' Roses|Use Your Illusion I|1991|K
Stairway to Heaven|Led Zeppelin|Led Zeppelin IV|1971|K
Wish You Were Here|Pink Floyd|Wish You Were Here|1975|K
Another Brick in the Wall, Pt. 2|Pink Floyd|The Wall|1979|K
Highway to Hell|AC/DC|Highway to Hell|1979|K
Back In Black|AC/DC|Back In Black|1980|K
Livin' On A Prayer|Bon Jovi|Slippery When Wet|1986|K
It's My Life|Bon Jovi|Crush|2000|K M
Summer Of '69|Bryan Adams|Reckless|1984|K
Heaven|Bryan Adams|Reckless|1984|R
(Everything I Do) I Do It For You|Bryan Adams|Robin Hood: Prince of Thieves|1991|R
Every Breath You Take|The Police|Synchronicity|1983|K
Billie Jean|Michael Jackson|Thriller|1982|P
Beat It|Michael Jackson|Thriller|1982|K
Thriller|Michael Jackson|Thriller|1982|P
Smooth Criminal|Michael Jackson|Bad|1987|P
Black or White|Michael Jackson|Dangerous|1991|P
Heal the World|Michael Jackson|Dangerous|1991|M
Take On Me|a-ha|Hunting High and Low|1985|O
Africa|TOTO|Toto IV|1982|K
Don't Stop Believin'|Journey|Escape|1981|K
Wonderwall|Oasis|(What's The Story) Morning Glory?|1995|K
Don't Look Back In Anger|Oasis|(What's The Story) Morning Glory?|1995|K
Creep|Radiohead|Pablo Honey|1992|K
Zombie|The Cranberries|No Need To Argue|1994|K
Losing My Religion|R.E.M.|Out Of Time|1991|K
Iris|The Goo Goo Dolls|Dizzy Up The Girl|1998|K
Hey Jude|The Beatles|Hey Jude|1968|K
Let It Be|The Beatles|Let It Be|1970|K
Here Comes The Sun|The Beatles|Abbey Road|1969|O
Yesterday|The Beatles|Help!|1965|S
Imagine|John Lennon|Imagine|1971|O
Dancing Queen|ABBA|Arrival|1976|P
Mamma Mia|ABBA|ABBA|1975|P
Gimme! Gimme! Gimme! (A Man After Midnight)|ABBA|Voulez-Vous|1979|P
Stayin' Alive|Bee Gees|Saturday Night Fever|1977|P
I Wanna Dance with Somebody (Who Loves Me)|Whitney Houston|Whitney|1987|P
I Will Always Love You|Whitney Houston|The Bodyguard|1992|R
My Heart Will Go On|Celine Dion|Let's Talk About Love|1997|R
Careless Whisper|George Michael|Make It Big|1984|R
Everybody (Backstreet's Back)|Backstreet Boys|Backstreet's Back|1997|P
As Long as You Love Me|Backstreet Boys|Backstreet's Back|1997|R
I Want It That Way|Backstreet Boys|Millennium|1999|O
Show Me the Meaning of Being Lonely|Backstreet Boys|Millennium|1999|S
Bye Bye Bye|*NSYNC|No Strings Attached|2000|O
...Baby One More Time|Britney Spears|...Baby One More Time|1999|O
Oops!...I Did It Again|Britney Spears|Oops!... I Did It Again|2000|O
Toxic|Britney Spears|In The Zone|2003|P
Wannabe|Spice Girls|Spice|1996|P
Barbie Girl|Aqua|Aquarium|1997|P
Blue (Da Ba Dee)|Eiffel 65|Europop|1999|P
Complicated|Avril Lavigne|Let Go|2002|K
Sk8er Boi|Avril Lavigne|Let Go|2002|K
Girlfriend|Avril Lavigne|The Best Damn Thing|2007|K
Whenever, Wherever|Shakira|Laundry Service|2001|P
Hips Don't Lie|Shakira|Oral Fixation Vol. 2|2006|P
Waka Waka (This Time for Africa)|Shakira|Listen Up! The Official 2010 FIFA World Cup Album|2010|P
Crazy In Love|Beyoncé|Dangerously In Love|2003|P
Halo|Beyoncé|I AM...SASHA FIERCE|2008|R
Single Ladies (Put a Ring on It)|Beyoncé|I AM...SASHA FIERCE|2008|P
Yeah!|Usher|Confessions|2004|P N
DJ Got Us Fallin' In Love|Usher|Raymond v Raymond|2010|P
Hey Ya!|Outkast|Speakerboxxx/The Love Below|2003|P
Low|Flo Rida|Mail On Sunday|2007|H P
Right Round|Flo Rida|R.O.O.T.S.|2009|P
Whistle|Flo Rida|Wild Ones|2012|P
Party Rock Anthem|LMFAO|Sorry For Party Rocking|2011|P
I Gotta Feeling|Black Eyed Peas|THE E.N.D.|2009|P
Where Is The Love?|Black Eyed Peas|Elephunk|2003|H
Pump It|Black Eyed Peas|Monkey Business|2005|P
TiK ToK|Kesha|Animal|2010|P
Dynamite|BTS|Dynamite|2020|P
Butter|BTS|Butter|2021|P
How You Like That|BLACKPINK|THE ALBUM|2020|P
Rather Be|Clean Bandit|New Eyes|2014|P
Rockabye|Clean Bandit|What Is Love?|2016|P
Shut Up and Dance|WALK THE MOON|TALKING IS HARD|2014|P
Cake By The Ocean|DNCE|DNCE|2015|P
CAN'T STOP THE FEELING!|Justin Timberlake|Trolls|2016|P
SexyBack|Justin Timberlake|FutureSex/LoveSounds|2006|P
Cry Me a River|Justin Timberlake|Justified|2002|S
Mirrors|Justin Timberlake|The 20/20 Experience|2013|R
Royals|Lorde|Pure Heroine|2013|O
Pumped Up Kicks|Foster The People|Torches|2011|K
Seven Nation Army|The White Stripes|Elephant|2003|K
505|Arctic Monkeys|Favourite Worst Nightmare|2007|K
Do I Wanna Know?|Arctic Monkeys|AM|2013|K
I Wanna Be Yours|Arctic Monkeys|AM|2013|R
Beggin'|Måneskin|Chosen|2017|K
Daylight|David Kushner|Daylight|2023|S
Dandelions|Ruth B.|Safe Haven|2017|R
golden hour|JVKE|this is what ____ feels like|2022|R
Dusk Till Dawn|ZAYN|Dusk Till Dawn|2017|R
PILLOWTALK|ZAYN|Mind Of Mine|2016|R
The Night We Met|Lord Huron|Strange Trails|2015|S
cold/mess|Prateek Kuhad|cold/mess|2018|C
Fly Me To The Moon|Frank Sinatra|It Might As Well Be Swing|1964|R
Can't Help Falling in Love|Elvis Presley|Blue Hawaii|1961|R
Jailhouse Rock|Elvis Presley|Jailhouse Rock|1957|K
What A Wonderful World|Louis Armstrong|What A Wonderful World|1967|C
Stand By Me|Ben E. King|Don't Play That Song|1961|R
`;
