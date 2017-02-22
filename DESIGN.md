# Design

The following document outlines the high-level design of this platform.

## Flow diagram

Interaction between Golang, JavaScript and MySQL.

The Worker is a simple thread that fetches user data as needed. Jobs executed
by the worker are not fault tolerant. This is a single node architecture.
Expanding this design to work mult-node is certainly doable based on the nature
of the data processing, however it is out of the scope of this project. If one
were to extend Worker written here, one might consider using a more
well-established data pipeline engine, like AWS Data Pipeline.

                  +--------+
                  | Worker |<-------+
                  +--------+        |
                      ^             v
                      |         +-------+
                      |         | MySQL |
                      |         +-------+
                      |             ^
                +-----------+       |
                | REST srvc |<------+
                +-----------+
                      ^
    BE                |
    ==================|==================
    FE                |
                      |
                      |
                      v
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
