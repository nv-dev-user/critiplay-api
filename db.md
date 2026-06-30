auth.users(…)

profiles(**id**, *canonicalUsername*, username)

organizations(**id**, name, created\_at, updated\_at)
roles(**id**, name) # roles : ROLE\_ADMIN, ROLE\_DEV, ROLE\_TEST

profile\_organisation(**id**, profile\_id, organization\_id, role\_id)

categories**(id**, *name***)** # cat. : RPG, Adult, Sci-fi, ...

tags(**id**, *name*) # tags : 2D, 3D, Pixel Art, ...



games**(**

    **id**, 

    *title*,

    category\_id,

    content,

    summary,

    created\_at,

    updated\_at

**)**



game\_tag**(id**, game\_id, tag\_id**)**