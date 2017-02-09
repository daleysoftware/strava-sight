# Design

The following document outlines the high-level design of this platform.

## Flow diagram

Interaction between Golang, JavaScript and RethinkDB.

                +-----------+
          +-----| Job Queue |<----+
          |     +-----------+     |
          v                       v
    +-----------+           +-----------+
    | WS server |<----+     | RethinkDB |
    +-----------+     |     +-----------+
          |           |           ^
          |           |           |
          |           |           v
          |           |     +-----------+
          |           +-----| REST srvc |
          |                 +-----------+
          |                       ^
    BE    |                       |
    ======|=======================|======
    FE    |                       |
          +------------ ----------+
                      | |
                      v v
                  +---------+
            +---->| Actions |-----+
            |     +---------+     |
            |                     v
        +-------+           +----------+
        | Views |           | Dispatch |
        +-------+           +----------+
            ^                     |
            |     +--------+      |
            +-----| Stores |<-----+
                  +--------+
